# Exemplo de Monitor TP
Exemplo didático de orquestração entre API e Core.

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
- Cada instância tem uma probabilidade de estar sobrecarregada de 50% inicialmente (isto pode ser alterado via REST utilizando a request abaixo):
```shell
PATCH http://<core_server_host>:<core_server_port>/ec021/sobrecarga
```

```json
{
    "sobrecarga": "50"
}
```
Onde o valor de sobrecarga deve ser entre 0 a 100. Caso queira uma sobrecarga aleatória, use o payload abaixo:
```json
{
    "sobrecarga": "random"
}
```

- Caso queira modificar as instâncias conhecidas pela API, altere o arquivo `.env` na propriedade `CORE_SERVERS` separando os servidores conhecidos por `;`. Exemplo:
```properties
CORE_SERVERS=localhost:5000;localhost:5001;localhost:5002;localhost:5003
```
- A API está configurada para escolher um `core` aleatoriamente entre as instâncias conhecidas (registradas neste array `CORE_SERVERS`).
- A quantidade de retentativas está configurada para 5, caso queira alterar modifique o valor da constante `RETRIES` no `.env` na `api`.
