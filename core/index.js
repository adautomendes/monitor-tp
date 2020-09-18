const restify = require('restify');
const server = restify.createServer();
const _ = require("lodash");

const PROB_SOBRECARGA = 50;

server.get('/ec021', (req, res) => {
    
    let prob = _.random(100);
    
    if (prob < PROB_SOBRECARGA) {
        console.log(`Container sobrecarreagdo...`);
        return res.json(503, { msg: `Container sobrecarreagdo...` });
    } else {
        console.log(`Executando rota GET...`);
        return res.json(200, { info: `Seu GET funcionou!` });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Core rodando na porta ${PORT}`);
});