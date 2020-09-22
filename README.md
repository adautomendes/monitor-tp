# Exemplo de Monitor TP
Exemplo didático de orquestração entre API e Core. Teste

## Como funciona?
- Execute a aplicação `core` em várias instâncias (Docker recomendado) nas portas 5000, 5001, 5002 e 5003.
- Execute a aplicação `monitor` na porta 3000.
- Utilize a collection `EC021 Monitor.postman_collection.json` para testar.

## Gerando imagem Docker
```shell
cd core
docker build -t <docker_user>/ec021_core .
```
- Suba 4 instâncias:

```shell
docker run --name ec021_core_1 -p 5000:5000 <docker_user>/ec021_core
docker run --name ec021_core_2 -p 5001:5000 <docker_user>/ec021_core
docker run --name ec021_core_3 -p 5002:5000 <docker_user>/ec021_core
docker run --name ec021_core_4 -p 5003:5000 <docker_user>/ec021_core
```

- Suba a API:

```shell
cd api
npm install
npm start
```

## Informações úteis
- Cada instância tem uma probabilidade de estar sobrecarregada de 50% (isto pode ser alterado mudando o valor da constante `PROB_SOBRECARGA` no `index.js` do `core`).
- Caso queira modificar as instâncias conhecidas pela API, altere o array `SERVERS` no `index.js` na `api`. A API está configurada para escolher um `core` aleatoriamente entre as instâncias conhecidas (registradas neste array).
- A quantidade de retentativas está configurada para 5, caso queira alterar modifique o valor da constante `RETRIES` no `index.js` na `api`.
