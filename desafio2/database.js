const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const criarBanco = async () => {
	const db = await open({
		filename: './database.db',
		driver: sqlite3.Database,
	});

	await db.exec(`
		PRAGMA foreign_keys = ON;

		CREATE TABLE IF NOT EXISTS pacientes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			nome TEXT NOT NULL,
			idade INTEGER,
			nivel_autonomia TEXT,
			condicoes_saude TEXT,
			necessidade_medicacao TEXT,
			endereco TEXT,
			contato_familiar TEXT,
			rotina_manha TEXT,
			rotina_tarde TEXT,
			rotina_noite TEXT,
			observacoes TEXT,
			status_acompanhamento TEXT DEFAULT 'Ativo',
			created_at TEXT DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS atendimentos (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			paciente_id INTEGER NOT NULL,
			data_atendimento TEXT NOT NULL,
			hora_atendimento TEXT NOT NULL,
			resumo TEXT NOT NULL,
			sinais_observados TEXT,
			medicacoes_ajustadas TEXT,
			proxima_acao TEXT,
			status_visita TEXT DEFAULT 'Registrado',
			created_at TEXT DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (paciente_id) REFERENCES pacientes (id) ON DELETE CASCADE
		);
	`);

	const totalPacientes = await db.get('SELECT COUNT(*) AS total FROM pacientes');

	if (totalPacientes.total === 0) {
		await db.exec(`
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
			) VALUES
			(
				'Dona Lúcia',
				82,
				'Baixa',
				'Hipertensão e mobilidade reduzida',
				'Remédios às 08h e 20h',
				'Rua das Flores, 120',
				'Ana - 11999990001',
				'Higiene, café e medicação',
				'Alimentação e repouso',
				'Jantar leve e organização do ambiente',
				'Precisa de apoio para banho em dias alternados',
				'Ativo'
			),
			(
				'Seu Alberto',
				76,
				'Média',
				'Diabetes e acompanhamento de memória',
				'Insulina conforme orientação familiar',
				'Avenida Central, 45',
				'Marcos - 11999990002',
				'Caminhada curta e café da manhã controlado',
				'Leitura, lanche e controle de glicemia',
				'Organização de medicação e preparo para dormir',
				'Familiares pedem relatório semanal por mensagem',
				'Ativo'
			),
			(
				'Dona Helena',
				88,
				'Baixa',
				'Recuperação pós-cirúrgica e necessidade de supervisão',
				'Analgésicos em horários fixos',
				'Rua Vitória, 310',
				'Paula - 11999990003',
				'Troca de curativo e organização do quarto',
				'Almoço monitorado e exercícios leves',
				'Banho assistido e checagem de sinais',
				'Registrar evolução diária para a família',
				'Ativo'
			)
		`);

		await db.exec(`
			INSERT INTO atendimentos (
				paciente_id,
				data_atendimento,
				hora_atendimento,
				resumo,
				sinais_observados,
				medicacoes_ajustadas,
				proxima_acao,
				status_visita
			) VALUES
			(
				1,
				'2026-04-14',
				'08:00',
				'Rotina matinal concluída com higiene e medicação.',
				'Sem febre, leve cansaço ao caminhar.',
				'Medicação mantida conforme orientação.',
				'Reavaliar mobilidade no próximo atendimento.',
				'Registrado'
			),
			(
				2,
				'2026-04-15',
				'14:00',
				'Acompanhamento da tarde com alimentação e controle glicêmico.',
				'Glicemia estável, paciente comunicativo.',
				'Insulina aplicada pela família.',
				'Enviar resumo ao familiar responsável.',
				'Registrado'
			)
		`);
	}

	return db;
};

module.exports = { criarBanco };
