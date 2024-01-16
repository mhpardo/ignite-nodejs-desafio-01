import fs from 'node:fs'
import { parse } from 'csv-parse'

const filePath = new URL('./data.csv', import.meta.url)

const csvFileReader = fs.createReadStream(filePath)

const csvReader = parse({
    delimiter: ',',
    fromLine: 2
});

async function executeParser() {

    const csvRows = csvFileReader.pipe(csvReader)

    for await (const r of csvRows) {
        
        const [title, description] = r;

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            })
        })
        await wait(1000)
    }

}

executeParser()

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
