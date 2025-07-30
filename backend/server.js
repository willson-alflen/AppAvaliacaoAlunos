// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import { google } from 'googleapis' // ✅ Importar aqui
// import {
//   getTurmas,
//   getAlunosPorTurma,
//   salvarAvaliacao,
// } from './services/googleSheetsService.js'

// dotenv.config()
// const app = express()

// app.use(cors())
// app.use(express.json())

// app.get('/turmas', async (req, res) => {
//   try {
//     const turmas = await getTurmas()
//     res.json(turmas)
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao buscar turmas' })
//   }
// })

// app.get('/alunos/:turma', async (req, res) => {
//   try {
//     const turmaSelecionada = req.params.turma

//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     })

//     const sheets = google.sheets({ version: 'v4', auth })

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GOOGLE_SHEET_ID,
//       range: 'Alunos!B2:C', // Coluna B = Nome, Coluna C = Turma
//     })

//     const alunos = response.data.values || []
//     const alunosFiltrados = alunos
//       .filter((aluno) => aluno[1] === turmaSelecionada)
//       .map((aluno) => aluno[0])

//     res.json(alunosFiltrados)
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Erro ao buscar alunos')
//   }
// })

// app.post('/avaliacao', async (req, res) => {
//   try {
//     await salvarAvaliacao(req.body)
//     res.json({ message: 'Avaliação salva com sucesso!' })
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao salvar avaliação' })
//   }
// })

// app.listen(process.env.PORT, () => {
//   console.log(`Servidor rodando na porta ${process.env.PORT}`)
// })

// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  getTurmas,
  getAlunosPorTurma,
  salvarAvaliacao,
} from './services/googleSheetsService.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.get('/turmas', async (req, res) => {
  try {
    const turmas = await getTurmas()
    res.json(turmas)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar turmas' })
  }
})

app.get('/alunos/:turma', async (req, res) => {
  try {
    const alunos = await getAlunosPorTurma(req.params.turma)
    res.json(alunos)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao buscar alunos')
  }
})

app.post('/avaliacao', async (req, res) => {
  try {
    await salvarAvaliacao(req.body)
    res.json({ message: 'Avaliação salva com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar avaliação' })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
})
