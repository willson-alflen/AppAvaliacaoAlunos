import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import {
  getTurmas,
  getAlunosPorTurma,
  salvarAvaliacao,
  getAvaliacoes,
} from './services/googleSheetsService.js'
import PDFDocument from 'pdfkit'
import archiver from 'archiver'

dotenv.config()
const app = express()

const allowedOrigins = [
  'https://app-avaliacao-alunos.vercel.app/',
  'http://localhost:5173',
]

app.use(
  cors({
    origin: function (origin, callback) {
      // permite requests sem origem (como curl/postman)
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true) // aceita a origem
      } else {
        callback(new Error('CORS policy: Origin não permitida'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // se precisar de cookie/autenticação
  })
)
app.use(express.json())

// ---------------- FUNÇÃO GERAR PDF ----------------
async function gerarPdfBuffer(av) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 })
      const chunks = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const fontPath = path.join(process.cwd(), 'fonts', 'DejaVuSans.ttf')
      doc.font(fontPath)

      // Cabeçalho
      doc
        .fontSize(18)
        .fillColor('#003366')
        .text('Ficha de Avaliação Qualitativa', { align: 'center' })
      doc.moveDown(1.5)

      doc
        .fontSize(12)
        .fillColor('#000')
        .text(`Nome do aluno(a): ${av.aluno}`)
        .text(`Turma: ${av.turma}`)
        .text(`Data: ${av.data}`)
      doc.moveDown(1.5)

      // Legenda
      doc.fontSize(12).text('Legenda:')
      const legenda = [
        '★☆☆☆☆ = Não demonstrado',
        '★★☆☆☆ = Em desenvolvimento',
        '★★★☆☆ = Adequado',
        '★★★★☆ = Bom domínio',
        '★★★★★ = Acima do esperado',
      ]
      legenda.forEach((item) => doc.text(item))
      doc.moveDown(1.5)

      // Tabela
      const colX = [40, 220, 440]
      const colWidths = [180, 220, 100]
      const tableStartY = doc.y
      let currentY = tableStartY

      // Cabeçalho da tabela
      doc
        .rect(
          colX[0],
          tableStartY,
          colWidths.reduce((a, b) => a + b),
          20
        )
        .fillColor('#cce5ff')
        .fill()
        .strokeColor('#000')
        .stroke()

      doc
        .font('Helvetica-Bold')
        .fillColor('#000')
        .text('Dimensão Avaliada', colX[0] + 5, currentY + 5, {
          width: colWidths[0],
        })
        .text('Descrição', colX[1] + 5, currentY + 5, { width: colWidths[1] })
        .text('Avaliação', colX[2] + 5, currentY + 5, { width: colWidths[2] })

      currentY += 20
      doc.font(fontPath).fillColor('#000')

      const lineSpacing = 8
      const paddingCell = 5

      const dimensoes = [
        {
          titulo: 'Compreensão Lógica e Aplicação prática',
          nota: av.avaliacoes[0],
          descricao:
            'Entende como os comandos funcionam e sabe usá-los para resolver os desafios',
        },
        {
          titulo: 'Autonomia',
          nota: av.avaliacoes[1],
          descricao:
            'Age com iniciativa, explora possibilidades, demonstra bom nível de independência',
        },
        {
          titulo: 'Colaboração',
          nota: av.avaliacoes[2],
          descricao:
            'Interage com colegas de forma respeitosa, compartilha ideias e ajuda os demais',
        },
        {
          titulo: 'Persistência',
          nota: av.avaliacoes[3],
          descricao:
            'Insiste diante dos desafios, testa novas abordagens e não desiste facilmente',
        },
        {
          titulo: 'Postura em sala de aula',
          nota: av.avaliacoes[4],
          descricao:
            'Segue regras e combinados, participa ativamente e demonstra interesse durante as aulas',
        },
      ]

      // Linhas da tabela
      dimensoes.forEach((dim) => {
        const startY = currentY

        const hTitulo = doc.heightOfString(dim.titulo, { width: colWidths[0] })
        const hDescricao = doc.heightOfString(dim.descricao, {
          width: colWidths[1],
        })
        const rowHeight = Math.max(hTitulo, hDescricao, 20) + lineSpacing
        const textOffsetY = lineSpacing / 2

        // Texto
        doc
          .fillColor('#000')
          .text(dim.titulo, colX[0] + paddingCell, startY + textOffsetY, {
            width: colWidths[0],
          })
        doc.text(dim.descricao, colX[1] + paddingCell, startY + textOffsetY, {
          width: colWidths[1],
        })

        // Estrelas coloridas
        const starSize = 12
        let starX = colX[2] + paddingCell
        const starY = startY + textOffsetY

        for (let i = 1; i <= 5; i++) {
          doc
            .fontSize(starSize)
            .fillColor(i <= dim.nota ? '#FFD700' : '#CCCCCC')
            .text('★', starX, starY, { width: starSize, align: 'left' })
          starX += starSize
        }

        // Bordas internas
        doc
          .strokeColor('#000')
          .rect(colX[0], startY, colWidths[0], rowHeight)
          .stroke()
          .rect(colX[1], startY, colWidths[1], rowHeight)
          .stroke()
          .rect(colX[2], startY, colWidths[2], rowHeight)
          .stroke()

        currentY += rowHeight
      })

      // Bordas externas
      const totalHeight = currentY - tableStartY
      const totalWidth = colWidths.reduce((a, b) => a + b)

      doc.rect(colX[0], tableStartY, totalWidth, totalHeight).stroke()

      // Observações
      doc.moveTo(40, currentY + 20)
      doc
        .font('Helvetica-Bold')
        .fillColor('#003366')
        .text('Observações do professor:', 40, currentY + 30, { align: 'left' })
      doc.moveDown(0.5)
      doc
        .font('Helvetica')
        .fillColor('#000')
        .text(av.observacoes || 'Nenhuma observação.', {
          width: 500,
          align: 'left',
        })

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

// ---------------- ROTAS ----------------
app.get('/turmas', async (req, res) => {
  try {
    const turmas = await getTurmas()
    res.json(turmas)
  } catch (err) {
    console.error(err)
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

app.get('/avaliacoes', async (req, res) => {
  try {
    const avaliacoes = await getAvaliacoes()
    res.json(avaliacoes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar avaliações' })
  }
})

app.get('/avaliacoes/meses', async (req, res) => {
  try {
    const avaliacoes = await getAvaliacoes()
    const mesesUnicos = [
      ...new Set(
        avaliacoes
          .map((av) => {
            if (!av.data) return null
            const partes = av.data.split('-')
            if (partes.length < 3) return null
            return `${partes[1]}-${partes[2]}`
          })
          .filter(Boolean)
      ),
    ]
    res.json(mesesUnicos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar meses disponíveis' })
  }
})

app.get('/relatorio/pdf/zip', async (req, res) => {
  try {
    const { turma, mes } = req.query
    const avaliacoes = await getAvaliacoes()

    const filtradas = avaliacoes.filter((av) => {
      const turmaOk = turma ? av.turma === turma : true
      const dataParts = av.data.split('-')
      const mesAno = `${dataParts[1]}-${dataParts[2]}`
      const mesOk = mes ? mesAno === mes : true
      return turmaOk && mesOk
    })

    if (!filtradas.length) {
      return res
        .status(404)
        .json({ message: 'Nenhuma avaliação encontrada para esse período.' })
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorios-${turma}.zip`
    )
    res.setHeader('Content-Type', 'application/zip')

    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(res)

    for (const av of filtradas) {
      const buffer = await gerarPdfBuffer(av)
      archive.append(buffer, { name: `ficha-avaliacao-${av.aluno}.pdf` })
    }

    await archive.finalize()
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao gerar PDFs individuais')
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
