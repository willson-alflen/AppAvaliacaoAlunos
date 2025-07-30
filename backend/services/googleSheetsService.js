import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

export async function getTurmas() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Turmas!A2:A',
  })
  return response.data.values ? response.data.values.flat() : []
}

export async function getAlunosPorTurma(turma) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Alunos!A2:B',
  })

  const alunos = response.data.values || []
  return alunos.filter((row) => row[1] === turma).map((row) => row[0])
}

export async function salvarAvaliacao(data) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Avaliações!A:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [
          data.turma,
          data.aluno,
          data.participacao,
          data.criatividade,
          data.observacoes,
        ],
      ],
    },
  })
}
