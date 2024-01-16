import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        })
            .catch(() => {
                //executa o método persist para criar o BD vazio em caso de ainda não existir
                this.#persist()
            })
    }

    //função privada (#) de persistência de dados em disco (arquivo)
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    //consulta
    select(table, search) {
        let data = this.#database[table] ?? []
        
        if (search) {
            data = data.filter(row => { 
                return Object.entries(search).some(([key,value])=> {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })

            })
        }
        return data
    }

    //inserção
    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            //se já existe uma tabela com esse nome no BD, só insere o registro
            this.#database[table].push(data)
        } else {
            //criar a tabela para depois persistir o registro
            this.#database[table] = [data]
        }
        //invocando método de persistência dos dados 
        this.#persist()
        return data;
    }

    //deleção
    delete(table, id) {
       const rowIndex = this.#database[table].findIndex(row => row.id === id)

       //se obter retorno -1 significa que o id não foi encontrado no BD
       if (rowIndex > -1) {
        this.#database[table].splice(rowIndex,1)
        this.#persist()  //atualiza o BD com a deleção realizada
       }

    }

     //atualização
     update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
 
        //se obter retorno -1 significa que o id não foi encontrado no BD
        if (rowIndex > -1) {
         this.#database[table][rowIndex] = {id, ...data}
         this.#persist()  //atualiza o BD com a deleção realizada
        }
     }
}