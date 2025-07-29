import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function SelectAluno({ turma, onChange }) {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!turma) return

    setLoading(true)
    fetch(`http://localhost:4000/alunos/${turma}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro na resposta do servidor')
        return res.json()
      })
      .then((data) => {
        setAlunos(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar alunos')
        setLoading(false)
      })
  }, [turma])

  if (!turma)
    return <p className="text-gray-500">Selecione uma turma primeiro</p>
  if (loading) return <LoadingSpinner />
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <select
      className="w-full p-2 border rounded-md"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecione</option>
      {alunos.map((aluno, i) => (
        <option key={i} value={aluno}>
          {aluno}
        </option>
      ))}
    </select>
  )
}
