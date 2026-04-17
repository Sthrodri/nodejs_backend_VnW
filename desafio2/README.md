# Desafio 2 - Rotina Cuidada

Backend em Node.js + SQLite para organizar a rotina fragmentada de uma cuidadora de idosos.

## Problema identificado

A cuidadora acompanha vários pacientes em casas diferentes e os registros ficam espalhados em cadernos, mensagens e memória. Isso dificulta consultar rotinas, acompanhar a evolução dos pacientes e repassar informações para familiares.

## Solução proposta

Centralizar as informações em uma API com duas camadas principais:

- cadastro de pacientes, com perfil, rotina e contatos
- registro de atendimentos, com data, resumo e próximos passos

## Tecnologias

- Node.js
- Express
- SQLite3
- CORS
- Nodemon

## Estrutura do banco

### pacientes

- `id`
- `nome`
- `idade`
- `nivel_autonomia`
- `condicoes_saude`
- `necessidade_medicacao`
- `endereco`
- `contato_familiar`
- `rotina_manha`
- `rotina_tarde`
- `rotina_noite`
- `observacoes`
- `status_acompanhamento`
- `created_at`

### atendimentos

- `id`
- `paciente_id`
- `data_atendimento`
- `hora_atendimento`
- `resumo`
- `sinais_observados`
- `medicacoes_ajustadas`
- `proxima_acao`
- `status_visita`
- `created_at`

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npm run dev
```

3. Acesse:

```text
http://localhost:3000
```

## Endpoints

### Home

- `GET /`

### Resumo geral

- `GET /resumo`

Retorna pacientes e atendimentos em uma única visão.

### Pacientes

- `GET /pacientes`
- `GET /pacientes/:id`
- `POST /pacientes`
- `PUT /pacientes/:id`
- `DELETE /pacientes/:id`

### Atendimentos

- `GET /atendimentos`
- `GET /atendimentos/:id`
- `POST /atendimentos`
- `PUT /atendimentos/:id`
- `DELETE /atendimentos/:id`

## Decisões tomadas

- Usei uma estrutura simples e coerente com o enunciado, centralizando dados do paciente e do atendimento.
- Adicionei uma visão consolidada em `/resumo` para ajudar a enxergar a evolução dos atendimentos.