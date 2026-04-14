const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const criarBanco = async () => {

    const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
    })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_problema TEXT,
        localizacao TEXT,
        descricao TEXT,
        prioridade TEXT,
        nome_solicitante TEXT,
        contato_solicitante TEXT,
        data_registro TEXT,
        hora_registro TEXT,
        status_resolucao TEXT DEFAULT 'Pendente',
        imagem_problema TEXT
    )
    `)

    console.log('Banco de dados configurado: A tabela de registros urbanos está pronta.')

    const checagem = await db.get('SELECT COUNT(*) AS total FROM incidentes')

        if (checagem.total === 0) {
            await db.exec(`
            INSERT INTO incidentes (tipo_problema, localizacao, descricao, prioridade, nome_solicitante, contato_solicitante, data_registro, hora_registro, status_resolucao, 
            imagem_problema) VALUES
            ('Buraco na Rua', 'Rua A, Bairro B', 'Há um buraco grande na rua que está causando transtornos para os motoristas.', 'Alta', 'João Silva', '11987654321', '2024-06-01', '14:30', 'Pendente', 'https://example.com/imagem_buraco.jpg'),
            ('Iluminação Pública', 'Avenida C, Bairro D', 'As lâmpadas da iluminação pública estão queimadas, deixando a área escura à noite.', 'Média', 'Maria Oliveira', '11912345678', '2024-06-02', '10:15', 'Pendente', 'https://example.com/imagem_iluminacao.jpg'),
            ('Árvore Caída', 'Parque E, Bairro F', 'Uma árvore caiu durante a tempestade e está bloqueando a entrada do parque.', 'Alta', 'Carlos Pereira', '11987654321', '2024-06-03', '16:45', 'Pendente', 'https://example.com/imagem_arvore.jpg'),
            ('Vazamento de Água', 'Rua G, Bairro H', 'Há um vazamento de água na rua que está causando alagamentos e danos à propriedade.', 'Alta', 'Ana Santos', '11912345678', '2024-06-04', '09:00', 'Pendente', 'https://example.com/imagem_vazamento.jpg'),
            ('Lixo Acumulado', 'Avenida I, Bairro J', 'O lixo acumulado na avenida está atraindo ratos e causando mau cheiro.', 'Média', 'Pedro Costa', '11987654321', '2024-06-05', '11:30', 'Pendente', 'https://example.com/imagem_lixo.jpg')
            `)
            console.log('Dados inseridos den\tro da tabela incidentes.')

        } else {
            console.log(`Banco pronto com ${checagem.total} incidentes`)
        }


    console.log('----- TOTAL DE INCIDENTES -----')
    const totalIncidentes = await db.all(`SELECT * FROM incidentes`)
    console.log(totalIncidentes)

    await db.run(`
        UPDATE incidentes
        SET status_resolucao = 'Resolvido'
        WHERE tipo_problema = 'Vazamento de Água'
        `)
    console.log('Incidente de vazamento de água atualizado para resolvido.')

    await db.run(`
        DELETE FROM incidentes
        WHERE tipo_problema = 'Lixo Acumulado'
        `)
    console.log('Incidente de lixo acumulado removido da tabela.')

    console.log('----- RELATÓRIO FINAL -----')
    const relatorioFinal = await db.all(`SELECT * FROM incidentes`)
    console.log(relatorioFinal)

    return db;

}

module.exports = { criarBanco }