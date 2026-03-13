const express = require('express');
const app = express(); 

//simulando um banco de dados
const usuarios = [
  { id: 1,
    nome: 'Picapau'
  },
  { id: 2, 
    nome: 'zé carioca'
  }
]

//rota raiz
app.get('/', (req, res) => {
  res.send('Oi amigo, vc é um amigo.');
})

//rota para a lista de usuários
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
})

//cria um novo usuário
app.post('/usuarios', (req, res) => {
    const novoUsuario = {
        id: usuarios.length + 1,
        nome: "sthe"
    }
    usuarios.push(novoUsuario); //adiciona o novo usuário à lista
    res.json(novoUsuario); //retorna o novo usuário
})

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});