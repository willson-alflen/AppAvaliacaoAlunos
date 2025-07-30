import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function SelectAluno({
  turmaSelecionada,
  onAlunoChange,
  value,
}) {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!turmaSelecionada) return

    setLoading(true)
    fetch(`http://localhost:4000/alunos/${turmaSelecionada}`)
      .then((res) => res.json())
      .then((data) => setAlunos(data))
      .catch((err) => console.error('Erro ao buscar alunos:', err))
      .finally(() => setLoading(false))
  }, [turmaSelecionada])

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <select
          className="p-2 border rounded w-full"
          value={value}
          onChange={(e) => onAlunoChange(e.target.value)}
          disabled={!turmaSelecionada}
        >
          <option value="">Selecione um aluno</option>
          {alunos.map((aluno, idx) => (
            <option key={idx} value={aluno}>
              {aluno}
            </option>
          ))}
        </select>
      )}
    </>
  )
}
