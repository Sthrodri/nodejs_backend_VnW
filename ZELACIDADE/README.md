# ZelaCidade API

API REST para registro e gestão de problemas urbanos (incidentes), usando Node.js, Express e SQLite.

## Funcionalidades

- Listar todos os incidentes
- Buscar incidente por ID
- Criar novo incidente
- Atualizar incidente existente
- Excluir incidente por ID

## Tecnologias

- Node.js
- Express
- SQLite3
- Nodemon
- CORS

## Estrutura do projeto

- `server.js`: configuração da API e rotas
- `database.js`: conexão com SQLite e inicialização da tabela
- `database.db`: banco de dados local (ignorado no Git)

## Requisitos

- Node.js 18.x (definido em `package.json`)
- npm

## Instalação

```bash
npm install
```

## Executando o projeto

Modo desenvolvimento (com recarregamento automático):

```bash
npm run dev
```

Modo produção/local simples:

```bash
npm start
```

Servidor disponível em:

```text
http://localhost:3000
```

## Endpoints

### 1) Home

- Método: GET
- Rota: `/`
- Descrição: retorna uma página HTML simples com informações da API.

### 2) Listar incidentes

- Método: GET
- Rota: `/incidentes`
- Descrição: retorna todos os incidentes cadastrados.

Exemplo:

```bash
curl http://localhost:3000/incidentes
```

### 3) Buscar incidente por ID

- Método: GET
- Rota: `/incidentes/:id`
- Descrição: retorna o incidente do ID informado.

Exemplo:

```bash
curl http://localhost:3000/incidentes/1
```

### 4) Criar incidente

- Método: POST
- Rota: `/incidentes`
- Content-Type: `application/json`

Body esperado:

```json
{
	"tipo_problema": "Queda de arvore",
	"localizacao": "Rua Central, 120",
	"descricao": "Arvore caiu sobre a calcada",
	"prioridade": "Alta",
	"nome_solicitante": "Maria",
	"contato_solicitante": "11999999999",
	"data_registro": "14-04-2026",
	"hora_registro": "10:20",
	"imagem_problema": "https://exemplo.com/imagem.jpg"
}
```

Exemplo:

```bash
curl -X POST http://localhost:3000/incidentes \
	-H "Content-Type: application/json" \
	-d '{
		"tipo_problema": "Queda de arvore",
		"localizacao": "Rua Central, 120",
		"descricao": "Arvore caiu sobre a calcada",
		"prioridade": "Alta",
		"nome_solicitante": "Maria",
		"contato_solicitante": "11999999999",
		"data_registro": "14-04-2026",
		"hora_registro": "10:20",
		"imagem_problema": "https://exemplo.com/imagem.jpg"
	}'
```

### 5) Atualizar incidente

- Método: PUT
- Rota: `/incidentes/:id`
- Content-Type: `application/json`

Body esperado:

```json
{
	"prioridade": "Media",
	"descricao": "Descricao atualizada",
	"status_resolucao": "Resolvido"
}
```

Exemplo:

```bash
curl -X PUT http://localhost:3000/incidentes/1 \
	-H "Content-Type: application/json" \
	-d '{
		"prioridade": "Media",
		"descricao": "Descricao atualizada",
		"status_resolucao": "Resolvido"
	}'
```

### 6) Excluir incidente

- Método: DELETE
- Rota: `/incidentes/:id`

Exemplo:

```bash
curl -X DELETE http://localhost:3000/incidentes/7
```

## Observações sobre o banco

- O arquivo `database.db` e criado automaticamente na primeira execucao.
- A tabela `incidentes` e criada automaticamente se nao existir.
- Quando o banco esta vazio, registros iniciais de exemplo sao inseridos.
- O script de banco tambem executa atualizacao e remocao de registros de exemplo (comportamento atual do projeto).

## CORS

CORS esta habilitado para permitir consumo da API por front-end em outro dominio/porta.

## Melhorias recomendadas

- Adicionar validacao de campos nas rotas
- Padronizar respostas de erro com status HTTP
- Criar testes automatizados
- Separar inicializacao do banco da logica de cada requisicao

## Licenca

ISC
