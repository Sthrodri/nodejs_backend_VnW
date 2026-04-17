const express = require('express');
const cors = require('cors');
const { criarBanco } = require('./database');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
	res.send(`
		<body style="font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; line-height: 1.5;">
			<h1>Rotina Cuidada</h1>
			<h2>Organização da rotina de atendimento individual</h2>
			<p>Backend em Node.js + SQLite para centralizar pacientes, rotinas e atendimentos.</p>
			<ul>
				<li><a href="/pacientes">/pacientes</a></li>
				<li><a href="/atendimentos">/atendimentos</a></li>
				<li><a href="/resumo">/resumo</a></li>
			</ul>
		</body>
	`);
});

app.get('/resumo', async (req, res) => {
	const db = await criarBanco();
	const pacientes = await db.all('SELECT * FROM pacientes ORDER BY id DESC');
	const atendimentos = await db.all(`
		SELECT a.*, p.nome AS paciente_nome
		FROM atendimentos a
		INNER JOIN pacientes p ON p.id = a.paciente_id
		ORDER BY a.data_atendimento DESC, a.hora_atendimento DESC
	`);

	res.json({
		total_pacientes: pacientes.length,
		total_atendimentos: atendimentos.length,
		pacientes,
		atendimentos,
	});
});

app.get('/pacientes', async (req, res) => {
	const db = await criarBanco();
	const pacientes = await db.all('SELECT * FROM pacientes ORDER BY id DESC');
	res.json(pacientes);
});

app.get('/pacientes/:id', async (req, res) => {
	const { id } = req.params;
	const db = await criarBanco();

	const paciente = await db.get('SELECT * FROM pacientes WHERE id = ?', [id]);

	if (!paciente) {
		return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
	}

	const atendimentos = await db.all(
		'SELECT * FROM atendimentos WHERE paciente_id = ? ORDER BY data_atendimento DESC, hora_atendimento DESC',
		[id]
	);

	res.json({ ...paciente, atendimentos });
});

app.post('/pacientes', async (req, res) => {
	const {
		nome,
		idade,
		nivel_autonomia,
		condicoes_saude,
		necessidade_medicacao,
		endereco,
		contato_familiar,
		rotina_manha,
		rotina_tarde,
		rotina_noite,
		observacoes,
		status_acompanhamento,
	} = req.body;

	if (!nome) {
		return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
	}

	const db = await criarBanco();
	const resultado = await db.run(
		`
			INSERT INTO pacientes (
				nome,
				idade,
				nivel_autonomia,
				condicoes_saude,
				necessidade_medicacao,
				endereco,
				contato_familiar,
				rotina_manha,
				rotina_tarde,
				rotina_noite,
				observacoes,
				status_acompanhamento
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
		[
			nome,
			idade,
			nivel_autonomia,
			condicoes_saude,
			necessidade_medicacao,
			endereco,
			contato_familiar,
			rotina_manha,
			rotina_tarde,
			rotina_noite,
			observacoes,
			status_acompanhamento || 'Ativo',
		]
	);

	const novoPaciente = await db.get('SELECT * FROM pacientes WHERE id = ?', [resultado.lastID]);
	res.status(201).json({ mensagem: 'Paciente cadastrado com sucesso.', paciente: novoPaciente });
});

app.put('/pacientes/:id', async (req, res) => {
	const { id } = req.params;
	const {
		nome,
		idade,
		nivel_autonomia,
		condicoes_saude,
		necessidade_medicacao,
		endereco,
		contato_familiar,
		rotina_manha,
		rotina_tarde,
		rotina_noite,
		observacoes,
		status_acompanhamento,
	} = req.body;

	const db = await criarBanco();
	const paciente = await db.get('SELECT * FROM pacientes WHERE id = ?', [id]);

	if (!paciente) {
		return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
	}

	await db.run(
		`
			UPDATE pacientes
			SET nome = ?, idade = ?, nivel_autonomia = ?, condicoes_saude = ?, necessidade_medicacao = ?,
					endereco = ?, contato_familiar = ?, rotina_manha = ?, rotina_tarde = ?, rotina_noite = ?,
					observacoes = ?, status_acompanhamento = ?
			WHERE id = ?
		`,
		[
			nome ?? paciente.nome,
			idade ?? paciente.idade,
			nivel_autonomia ?? paciente.nivel_autonomia,
			condicoes_saude ?? paciente.condicoes_saude,
			necessidade_medicacao ?? paciente.necessidade_medicacao,
			endereco ?? paciente.endereco,
			contato_familiar ?? paciente.contato_familiar,
			rotina_manha ?? paciente.rotina_manha,
			rotina_tarde ?? paciente.rotina_tarde,
			rotina_noite ?? paciente.rotina_noite,
			observacoes ?? paciente.observacoes,
			status_acompanhamento ?? paciente.status_acompanhamento,
			id,
		]
	);

	const atualizado = await db.get('SELECT * FROM pacientes WHERE id = ?', [id]);
	res.json({ mensagem: 'Paciente atualizado com sucesso.', paciente: atualizado });
});

app.delete('/pacientes/:id', async (req, res) => {
	const { id } = req.params;
	const db = await criarBanco();

	const paciente = await db.get('SELECT * FROM pacientes WHERE id = ?', [id]);
	if (!paciente) {
		return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
	}

	await db.run('DELETE FROM pacientes WHERE id = ?', [id]);
	res.json({ mensagem: 'Paciente removido com sucesso.' });
});

app.get('/atendimentos', async (req, res) => {
	const db = await criarBanco();
	const atendimentos = await db.all(`
		SELECT a.*, p.nome AS paciente_nome
		FROM atendimentos a
		INNER JOIN pacientes p ON p.id = a.paciente_id
		ORDER BY a.data_atendimento DESC, a.hora_atendimento DESC
	`);
	res.json(atendimentos);
});

app.get('/atendimentos/:id', async (req, res) => {
	const { id } = req.params;
	const db = await criarBanco();

	const atendimento = await db.get(
		`
			SELECT a.*, p.nome AS paciente_nome
			FROM atendimentos a
			INNER JOIN pacientes p ON p.id = a.paciente_id
			WHERE a.id = ?
		`,
		[id]
	);

	if (!atendimento) {
		return res.status(404).json({ mensagem: 'Atendimento não encontrado.' });
	}

	res.json(atendimento);
});

app.post('/atendimentos', async (req, res) => {
	const {
		paciente_id,
		data_atendimento,
		hora_atendimento,
		resumo,
		sinais_observados,
		medicacoes_ajustadas,
		proxima_acao,
		status_visita,
	} = req.body;

	if (!paciente_id || !data_atendimento || !hora_atendimento || !resumo) {
		return res.status(400).json({
			mensagem: 'Os campos paciente_id, data_atendimento, hora_atendimento e resumo são obrigatórios.',
		});
	}

	const db = await criarBanco();
	const paciente = await db.get('SELECT * FROM pacientes WHERE id = ?', [paciente_id]);

	if (!paciente) {
		return res.status(404).json({ mensagem: 'Paciente informado não existe.' });
	}

	const resultado = await db.run(
		`
			INSERT INTO atendimentos (
				paciente_id,
				data_atendimento,
				hora_atendimento,
				resumo,
				sinais_observados,
				medicacoes_ajustadas,
				proxima_acao,
				status_visita
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`,
		[
			paciente_id,
			data_atendimento,
			hora_atendimento,
			resumo,
			sinais_observados,
			medicacoes_ajustadas,
			proxima_acao,
			status_visita || 'Registrado',
		]
	);

	const novoAtendimento = await db.get('SELECT * FROM atendimentos WHERE id = ?', [resultado.lastID]);
	res.status(201).json({ mensagem: 'Atendimento registrado com sucesso.', atendimento: novoAtendimento });
});

app.put('/atendimentos/:id', async (req, res) => {
	const { id } = req.params;
	const {
		paciente_id,
		data_atendimento,
		hora_atendimento,
		resumo,
		sinais_observados,
		medicacoes_ajustadas,
		proxima_acao,
		status_visita,
	} = req.body;

	const db = await criarBanco();
	const atendimento = await db.get('SELECT * FROM atendimentos WHERE id = ?', [id]);

	if (!atendimento) {
		return res.status(404).json({ mensagem: 'Atendimento não encontrado.' });
	}

	await db.run(
		`
			UPDATE atendimentos
			SET paciente_id = ?, data_atendimento = ?, hora_atendimento = ?, resumo = ?, sinais_observados = ?,
					medicacoes_ajustadas = ?, proxima_acao = ?, status_visita = ?
			WHERE id = ?
		`,
		[
			paciente_id ?? atendimento.paciente_id,
			data_atendimento ?? atendimento.data_atendimento,
			hora_atendimento ?? atendimento.hora_atendimento,
			resumo ?? atendimento.resumo,
			sinais_observados ?? atendimento.sinais_observados,
			medicacoes_ajustadas ?? atendimento.medicacoes_ajustadas,
			proxima_acao ?? atendimento.proxima_acao,
			status_visita ?? atendimento.status_visita,
			id,
		]
	);

	const atualizado = await db.get('SELECT * FROM atendimentos WHERE id = ?', [id]);
	res.json({ mensagem: 'Atendimento atualizado com sucesso.', atendimento: atualizado });
});

app.delete('/atendimentos/:id', async (req, res) => {
	const { id } = req.params;
	const db = await criarBanco();

	const atendimento = await db.get('SELECT * FROM atendimentos WHERE id = ?', [id]);
	if (!atendimento) {
		return res.status(404).json({ mensagem: 'Atendimento não encontrado.' });
	}

	await db.run('DELETE FROM atendimentos WHERE id = ?', [id]);
	res.json({ mensagem: 'Atendimento removido com sucesso.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
