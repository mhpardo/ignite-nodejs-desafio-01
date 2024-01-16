//Importação ESModules => Usa os comandos import/export (não nativo no Node.js)
import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

//instanciando o servidor web baseado em Node.js
const server = http.createServer(async (req, res) => {
    const { method, url } = req

    //chamada middleware
    await json(req, res)

    console.log(method, url)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    //se a rota for encontrada
    if (route) {
        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    //Caso não encontre nenhuma rota compatível
    return res.writeHead(404).end()

})

//acionando o servidor
server.listen(3333)  //porta 3333 será aberta no localhost
