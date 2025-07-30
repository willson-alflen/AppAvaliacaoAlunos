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
  const sheets = await authSheets()

  // Converter as avaliações em colunas separadas (uma por dimensão)
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
          new Date().toLocaleString(),
        ],
      ],
    },
  })
}
