export async function json(req, res) {
    //Uso de Buffers com Streaming
    const buffers = []

    for await (const chunk of req) {
        //pega cada pedaço do stream dentro da req e vai adicionando no array buffers
        buffers.push(chunk)
    }

    try {
        //concatenando cada pedaço do stream dentro do buffer para uma única String
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    //padronizando todas as respostas como JSON
    res.setHeader('Content-type', 'application/json')

    //imprimindo o body recebido na req
    console.log(req.body)
}