import React, { useState } from 'react'
import SelectTurma from './SelectTurma'
import SelectAluno from './SelectAluno'

export default function AvaliacaoForm() {
  const [turma, setTurma] = useState('')
  const [aluno, setAluno] = useState('')
  const [participacao, setParticipacao] = useState(1)
  const [criatividade, setCriatividade] = useState(1)
  const [observacoes, setObservacoes] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turma,
          aluno,
          participacao,
          criatividade,
          observacoes,
        }),
      })

      if (!response.ok) throw new Error('Erro ao enviar avaliação')

      setMensagem('✅ Avaliação enviada com sucesso!')
    } catch {
      setMensagem('❌ Erro ao enviar avaliação')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold mb-2">Ficha de Avaliação</h2>

      <div>
        <label className="block text-gray-700 mb-1">Turma:</label>
        <SelectTurma onChange={setTurma} />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Aluno:</label>
        <SelectAluno turma={turma} onChange={setAluno} />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">
          Participação (1 a 5):
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={participacao}
          onChange={(e) => setParticipacao(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">
          Criatividade (1 a 5):
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={criatividade}
          onChange={(e) => setCriatividade(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Observações:</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Enviar Avaliação
      </button>

      {mensagem && <p className="text-center mt-2">{mensagem}</p>}
    </form>
  )
}
