const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('API de filmes')
})

const filmes = [
    {
        id: 1,
        titulo: 'A culpa é das estrelas',
        genero: 'Romance'
    },
    {
        id: 2,
        titulo: 'Pânico',
        genero: 'Terror'
    },
    {
        id: 3,
        titulo: 'Vingadores',
        genero: 'Ação'
    }
]

app.get('/filmes', (req, res) => {
    res.send(filmes)
})

app.post('/filmes', (req, res) => {
    const novofilme = {
        id: filmes.length + 1,
        titulo: 'Senhor dos Anéis',
        genero: 'Aventura'
    }
    filmes.push(novofilme)
})


/*
//gambiarra para visualizar o novo filme adicionado.
app.get('/novo-filmes', (req, res) => {
    const novofilme = {
        id: filmes.length + 1,
        titulo: 'Senhor dos Anéis',
        genero: 'Aventura'
    }
    filmes.push(novofilme)
    res.send(novofilme)
})*/


const port = 3000

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`)
})