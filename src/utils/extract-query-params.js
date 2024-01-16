export function extractQueryParams (query) {
    return query.substr(1).split('&').reduce((queryParams, param)=> {
        const [key,value] = param.split('=')
        
        queryParams[key] = value
        console.log('******')
        console.log(queryParams)
        console.log('******')
        return queryParams
    },{})

}