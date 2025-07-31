import { useState, useEffect } from 'react'

export default function BotaoGerarPDF({ turmaSelecionada }) {
  const [mesSelecionado, setMesSelecionado] = useState('')
  const [meses, setMeses] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const listaMeses = []
    const hoje = new Date()

    for (let i = 0; i < 12; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const mes = String(data.getMonth() + 1).padStart(2, '0')
      const ano = data.getFullYear()
      listaMeses.push({
        label: `${mes}/${ano}`,
        value: `${mes}-${ano}`,
      })
    }

    setMeses(listaMeses)
  }, [])

  const handleGerarPDF = async () => {
    if (!turmaSelecionada || !mesSelecionado) {
      setMensagem('⚠️ Selecione a turma e o mês antes de gerar o relatório.')
      return
    }

    try {
      setLoading(true)
      setMensagem('')

      const response = await fetch(
        `http://localhost:4000/relatorio/pdf/zip?turma=${turmaSelecionada}&mes=${mesSelecionado}`
      )

      if (response.status === 404) {
        setMensagem('📭 Nenhuma avaliação encontrada para esse período.')
        return
      }

      if (!response.ok) {
        throw new Error('Erro ao gerar PDFs')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorios-${turmaSelecionada}-${mesSelecionado}.zip`
      a.click()
      window.URL.revokeObjectURL(url)

      setMensagem('✅ Relatórios gerados com sucesso!')
    } catch (err) {
      console.error(err)
      setMensagem('❌ Erro inesperado ao gerar os relatórios.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md mt-6 shadow-md">
      <h3 className="text-lg font-semibold mb-2">
        📄 Gerar Relatórios Individuais
      </h3>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Mês:</label>
        <select
          className="p-2 border rounded w-full"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        >
          <option value="">Selecione o mês</option>
          {meses.map((m, idx) => (
            <option key={idx} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGerarPDF}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white ${
          loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {loading ? 'Gerando PDFs...' : 'Gerar Relatórios'}
      </button>

      {mensagem && (
        <p className="text-center mt-2 text-sm text-gray-700">{mensagem}</p>
      )}
    </div>
  )
}
