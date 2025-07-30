import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function SelectTurma({ onTurmaChange, value }) {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:4000/turmas')
      .then((res) => res.json())
      .then((data) => setTurmas(data))
      .catch((err) => console.error('Erro ao buscar turmas:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <select
          className="p-2 border rounded w-full"
          value={value}
          onChange={(e) => onTurmaChange(e.target.value)}
        >
          <option value="">Selecione uma turma</option>
          {turmas.map((turma, idx) => (
            <option key={idx} value={turma}>
              {turma}
            </option>
          ))}
        </select>
      )}
    </>
  )
}
