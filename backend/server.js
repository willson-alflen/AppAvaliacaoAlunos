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
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos' })
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
