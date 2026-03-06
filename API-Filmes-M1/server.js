const express = require('express')

const app = express()

app.use(express.json())

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

app.get('/filmes/:id', (req, res) => {
    const idUrl = Number(req.params.id)
    const filmesEncontrados = filmes.find(filmes => filmes.id === idUrl)

    res.json(filmesEncontrados)
})

app.post('/filmes', (req, res) => {
    
    filmes.push(req.body)

    res.send("Filme adicionado com sucesso!")

})

const port = 3000

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`)
})