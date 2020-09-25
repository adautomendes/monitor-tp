const restify = require('restify');
const server = restify.createServer();
const _ = require("lodash");

var PROB_SOBRECARGA = 50;

server.use(restify.plugins.bodyParser());

server.get('/ec021', (req, res) => {
    let sobrecarga = PROB_SOBRECARGA;
    if (PROB_SOBRECARGA == "random") {
        sobrecarga = _.random(100);
    }

    let prob = _.random(100);

    if (prob < sobrecarga) {
        console.log(`Container sobrecarreagdo...`);
        return res.json(503, { msg: `Container sobrecarreagdo...`, sobrecarga: `${sobrecarga}%` });
    } else {
        console.log(`Executando rota GET...`);
        return res.json(200, { info: `Seu GET funcionou!`, sobrecarga: `${sobrecarga}%` });
    }
});

server.patch('/ec021/sobrecarga', (req, res) => {
    PROB_SOBRECARGA = req.body.sobrecarga;

    return res.json(200, { sobrecarga: `${PROB_SOBRECARGA}%` });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Core rodando na porta ${PORT}`);
});