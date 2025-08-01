import { useState, useEffect } from 'react'
import SelectTurma from './SelectTurma'
import SelectAluno from './SelectAluno'
import DimensaoAvaliacao from './DimensaoAvaliacao'
import LoadingSpinner from './LoadingSpinner'
import BotaoGerarPDF from './BotaoGerarPDF'

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

  const API_URL = import.meta.env.VITE_API_URL

  const handleNotaChange = (index, nota) => {
    const novasAvaliacoes = [...avaliacoes]
    novasAvaliacoes[index].nota = nota
    setAvaliacoes(novasAvaliacoes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/avaliacao`, {
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

  // Limpa mensagem de sucesso automaticamente após 3 segundos
  useEffect(() => {
    if (mensagem.startsWith('✅')) {
      const timer = setTimeout(() => setMensagem(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [mensagem])

  // Validação para habilitar botão
  const podeEnviar =
    turmaSelecionada && alunoSelecionado && avaliacoes.every((a) => a.nota > 0)

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Ficha de Avaliação</h2>

      {/* Seção de seleção */}
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

      {/* Dimensões de avaliação */}
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

      {/* Observações */}
      <div>
        <label className="block mb-1 font-medium">Observações:</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Botão enviar */}
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

      {mensagem && (
        <div
          className={`
      relative text-center mt-2 bg-gray-50 border rounded-md px-4 py-2 shadow-sm 
      transition-opacity duration-500 ease-in-out
      ${mensagem ? 'opacity-100' : 'opacity-0'}
    `}
        >
          <p
            className={`${
              mensagem.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            } font-medium`}
          >
            {mensagem}
          </p>
          {mensagem.startsWith('❌') && (
            <button
              onClick={() => setMensagem('')}
              className="absolute top-1 right-2 text-gray-400 hover:text-red-600 text-lg font-bold"
              aria-label="Fechar"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Seção de geração de relatórios */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">
          📄 Relatórios de Avaliações
        </h3>
        <p className="text-gray-600 mb-4">
          Gere relatórios individuais em PDF para todos os alunos da turma
          selecionada. Você também pode filtrar por data para gerar apenas
          avaliações de um dia específico.
        </p>
        <BotaoGerarPDF turmaSelecionada={turmaSelecionada} />
      </div>
    </form>
  )
}
