const sqlite3 = require('sqlite3');
const path = require('path');

const { open } = require('sqlite');

const criaBanco = async() => {
    const db = await open({
        filename: path.join(__dirname, 'bancoDeDados.db'),
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            categoria TEXT,
            quantidade INTEGER,
            preco REAL
        )
    `)

    const checagem = await db.get('SELECT count(*) AS total FROM produtos')

    if (checagem.total === 0) {
        console.log(`Banco pronto com checagem ${checagem.total} de produtos.`)

        await db.exec(`
        INSERT INTO produtos (nome, categoria, quantidade, preco) VALUES
            ('Samsung G24', 'Eletrônicos', 50, 1029.99),
            ('Notebook Hp elitebook', 'Informática', 30, 4299.99),
            ('Cadeira Gamer RGB', 'Móveis', 20, 1249.99)
        `)
    } else {
        console.log(`Os produtos já foram inseridos anteriormente.`)
    }

    console.log("------------ Total de produtos ------------")
    const totalProdutos = await db.all('SELECT * FROM produtos')
    console.log(totalProdutos)


    const invetario = await db.all('SELECT * FROM produtos')
    console.log("Inventário atualizado:")
    console.log(invetario)
    

    const produtosEspecifico = await db.all('SELECT preco FROM produtos WHERE id = 2')
    console.log("Produtos específicos:")
    console.log(produtosEspecifico)

    await db.run(`
        UPDATE produtos -- atualize produtos
        SET preco = 4500.00,
        quantidade = 50
        WHERE id = 2 -- no id 2
        `)

    await db.run(`
        DELETE FROM produtos
        WHERE id = 3
        `)
    

    console.log("Preço do notebook atualizado.")

}

criaBanco()