import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function SelectTurma({ onChange }) {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:4000/turmas')
      .then((res) => {
        if (!res.ok) throw new Error('Erro na resposta do servidor')
        return res.json()
      })
      .then((data) => {
        setTurmas(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar turmas')
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <select
      className="w-full p-2 border rounded-md"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecione</option>
      {turmas.map((turma, i) => (
        <option key={i} value={turma}>
          {turma}
        </option>
      ))}
    </select>
  )
}
