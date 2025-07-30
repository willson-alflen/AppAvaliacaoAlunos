import { useState, useEffect } from 'react'
import SelectTurma from './SelectTurma'
import SelectAluno from './SelectAluno'
import DimensaoAvaliacao from './DimensaoAvaliacao'
import LoadingSpinner from './LoadingSpinner'

const DIMENSOES = [
  {
    titulo: 'Compreensão lógica e aplicação prática',
    descricao:
      'Entende como os comandos funcionam e sabe usá-los para resolver os desafios',
  },
  {
    titulo: 'Autonomia',
    descricao:
      'Age com iniciativa, explora possibilidades, demonstra bom nível de independência',
  },
  {
    titulo: 'Colaboração',
    descricao:
      'Interage com colegas de forma respeitosa, compartilha ideias e ajuda os demais',
  },
  {
    titulo: 'Persistência',
    descricao:
      'Insiste diante dos desafios, testa novas abordagens e não desiste facilmente',
  },
  {
    titulo: 'Postura em sala de aula',
    descricao:
      'Segue regras e combinados, participa ativamente e demonstra interesse durante as aulas',
  },
]

export default function AvaliacaoForm() {
  const [turmaSelecionada, setTurmaSelecionada] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState('')
  const [avaliacoes, setAvaliacoes] = useState(
    DIMENSOES.map((dim) => ({ dimensao: dim.titulo, nota: 0 }))
  )
  const [observacoes, setObservacoes] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNotaChange = (index, nota) => {
    const novasAvaliacoes = [...avaliacoes]
    novasAvaliacoes[index].nota = nota
    setAvaliacoes(novasAvaliacoes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turmaSelecionada,
          alunoSelecionado,
          avaliacoes,
          observacoes,
        }),
      })

      if (!response.ok) throw new Error('Erro ao enviar avaliação')

      setMensagem('✅ Avaliação enviada com sucesso!')
      setAlunoSelecionado('')
      setAvaliacoes(DIMENSOES.map((dim) => ({ dimensao: dim.titulo, nota: 0 })))
      setObservacoes('')
    } catch {
      setMensagem('❌ Erro ao enviar avaliação')
    } finally {
      setLoading(false)
    }
  }

  // 🔄 Limpa mensagem automaticamente após 3 segundos
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [mensagem])

  // 🔄 Limpa mensagem se turma ou aluno mudar
  useEffect(() => {
    if (mensagem) setMensagem('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaSelecionada, alunoSelecionado])

  // Validação para habilitar botão
  const podeEnviar =
    turmaSelecionada && alunoSelecionado && avaliacoes.every((a) => a.nota > 0)

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Ficha de Avaliação</h2>

      <div>
        <label className="block mb-1 font-medium">Turma:</label>
        <SelectTurma
          onTurmaChange={setTurmaSelecionada}
          value={turmaSelecionada}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Aluno:</label>
        <SelectAluno
          turmaSelecionada={turmaSelecionada}
          onAlunoChange={setAlunoSelecionado}
          value={alunoSelecionado}
        />
      </div>

      <div className="space-y-4">
        {DIMENSOES.map((dim, index) => (
          <DimensaoAvaliacao
            key={index}
            titulo={dim.titulo}
            descricao={dim.descricao}
            nota={avaliacoes[index].nota}
            onNotaChange={(nota) => handleNotaChange(index, nota)}
          />
        ))}
      </div>

      <div>
        <label className="block mb-1 font-medium">Observações:</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={!podeEnviar || loading}
        className={`w-full py-2 px-4 rounded-md text-white flex justify-center items-center ${
          podeEnviar && !loading
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? <LoadingSpinner /> : 'Enviar Avaliação'}
      </button>

      {mensagem && <p className="text-center mt-2">{mensagem}</p>}
    </form>
  )
}
