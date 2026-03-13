const sqlite3 = require('sqlite3');

const { open } = require('sqlite');

const criaBanco = async() => {
    const db = await open({
        filename: './bancoDeDados.db',
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
    
    await db.exec(`
        INSERT INTO produtos (nome, categoria, quantidade, preco) VALUES
            ('Samsung G24', 'Eletrônicos', 50, 1029.99),
            ('Notebook Hp elitebook', 'Informática', 30, 4299.99),
            ('Cadeira Gamer RGB', 'Móveis', 20, 1249.99)
    `)

    const invetario = await db.all('SELECT * FROM produtos')
    console.log(invetario)
    

    console.log("Prontos para receber os mercadorias!")

}

criaBanco()