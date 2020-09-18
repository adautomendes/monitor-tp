const restify = require('restify');
const server = restify.createServer();
const axios = require('axios').default;
const _ = require("lodash");

const SERVERS = ['http://localhost:5000', 'http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
const RETRIES = 5;

server.get('/ec021', async (req, res) => {
    let config = {
        headers: {},
        data: {}
    };

    let errorResponses = [];
    for (let i = 1; i <= RETRIES; i++) {
        let timeStamp = new Date();
        let url = SERVERS[_.random(SERVERS.length - 1)] + `/ec021`;

        if (i == 1) {
            console.log(`Enviando request para o server: ${url}`);
        } else {
            console.log(`Reenviando request para o server: ${url}`);
        }

        let axiosRes;
        await axios.get(url, config)
            .then((response) => {
                console.log(`Sucesso em ${url}`);
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

        if (axiosRes && axiosRes.status == 200) { //Sucesso
            return res.json(200, {
                status: `OK`,
                tryNo: i,
                response: axiosRes.data,
                successTime: timeStamp,
                errorResponses
            });
        } else {
            errorResponses.push(axiosRes);
        }
    }

    return res.json(500, { nRetries: RETRIES, status: `Falha`, errorResponses });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Monitor rodando na porta ${PORT}`);
});