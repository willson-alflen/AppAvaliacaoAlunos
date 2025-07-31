import { google } from 'googleapis'

async function authSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

export async function getTurmas() {
  const sheets = await authSheets()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Turmas!A2:A',
  })

  return response.data.values?.flat() || []
}

export async function getAlunosPorTurma(turmaSelecionada) {
  const sheets = await authSheets()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Alunos!B2:C', // Coluna B = Nome, Coluna C = Turma
  })

  const alunos = response.data.values || []
  return alunos
    .filter((aluno) => aluno[1] === turmaSelecionada)
    .map((aluno) => aluno[0])
}

/**
 * Salva avaliação com múltiplas dimensões
 */
export async function salvarAvaliacao({
  turmaSelecionada,
  alunoSelecionado,
  avaliacoes, // [{ dimensao: '...', nota: 4 }, ...]
  observacoes,
}) {
  const hoje = new Date()
  const dia = String(hoje.getDate()).padStart(2, '0')
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const ano = hoje.getFullYear()
  const dataFormatada = `${dia}-${mes}-${ano}`
  const sheets = await authSheets()

  // Converte as avaliações em colunas separadas (uma por dimensão)
  const avaliacoesNotas = avaliacoes.map((av) => av.nota)

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Avaliações!A2',
    valueInputOption: 'RAW',
    resource: {
      values: [
        [
          turmaSelecionada,
          alunoSelecionado,
          ...avaliacoesNotas, // 5 colunas (uma por dimensão)
          observacoes,
          dataFormatada,
        ],
      ],
    },
  })
}

export async function getAvaliacoes() {
  const sheets = await authSheets()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Avaliações!A2:I', // Colunas: A=Turma, B=Aluno, C-G=Notas (5 dimensões), H=Observações, I=Data
  })

  const rows = response.data.values || []
  return rows.map((row) => ({
    turma: row[0] || '',
    aluno: row[1] || '',
    avaliacoes: row.slice(2, 7).map((nota) => Number(nota) || 0), // colunas C a G (índices 2 a 6) são as 5 dimensões
    observacoes: row[7] || '',
    data: row[8] || '', // Data no formato "DD-MM-YYYY"
  }))
}
