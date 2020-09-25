const restify = require('restify');
const server = restify.createServer();
const axios = require('axios').default;
const _ = require("lodash");
require('dotenv').config();

const SERVERS = [];
const RETRIES = process.env.RETRIES;

//Middleware usado para registrar os servidores conhecidos
server.use((req, res, next) => {
    const serverList = process.env.CORE_SERVERS.split(';');

    serverList.forEach(server => {
        SERVERS.push({
            location: `http://${server}`,
            isOk: true
        });
    });

    next();
});

server.get('/ec021', async (req, res) => {
    let config = {
        headers: {},
        data: {}
    };

    let errorResponses = [];
    for (let i = 1; i <= RETRIES; i++) {
        let timeStamp = new Date();

        // Checking if the request exausts attempts in all CORE Servers
        let trueFound = false;

        for (let j = 0; j < SERVERS.length; j++) {
            if (SERVERS[j].isOk) {
                trueFound = true;
                break;
            }
        }

        if (!trueFound) {
            return res.json(503, {
                status: `Error`,
                tryNo: i,
                response: `No CORE server available.`,
                successTime: timeStamp,
                errorResponses
            });
        }

        //Getting next available server
        let pos;
        let serverFound = false;
        while (!serverFound) {
            pos = _.random(SERVERS.length - 1);
            let server = SERVERS[pos];

            if (server.isOk) {
                serverFound = true;
            }
        }

        let url = SERVERS[pos].location + `/ec021`;

        if (i == 1) {
            console.log(`[${i}] - Enviando request para o server: ${url}`);
        } else {
            console.log(`[${i}] - Reenviando request para o server: ${url}`);
        }

        let axiosRes;
        await axios.get(url, config)
            .then((response) => {
                console.log(`[${i}] - Sucesso em ${url}`);
                axiosRes = response;
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    axiosRes = {
                        nRetry: i,
                        errorTime: timeStamp,
                        url,
                        code: error.response.status,
                        error: error.response.data
                    }
                } else if (error.request) {
                    // The request was made but no response was received (timeout or server out of service)
                    axiosRes = {
                        nRetry: i,
                        errorTime: timeStamp,
                        url,
                        code: error.code
                    }
                }
            });

        if (axiosRes && axiosRes.status == 200) { // Success
            return res.json(200, {
                status: `OK`,
                tryNo: i,
                response: axiosRes.data,
                successTime: timeStamp,
                errorResponses
            });
        } else {
            SERVERS[pos].isOk = false; // If request fails, flags this server as not ok
            errorResponses.push(axiosRes);
        }
    }

    return res.json(500, { nRetries: RETRIES, status: `Falha`, errorResponses });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Monitor rodando na porta ${PORT}`);
});