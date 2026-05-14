import { useEffect, useState } from "react"
import type { PropostaType } from "../utils/PropostaType"
import { fetchWithToken } from "./utils/fetchWithToken"

const apiUrl = import.meta.env.VITE_API_URL

type ModalState = {
  isOpen: boolean
  propostaId: number | null
  acao: "ACEITA" | "RECUSADA" | null
  resposta: string
}

export default function AdminPropostas() {
  const [propostas, setPropostas] = useState<PropostaType[]>([])
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    propostaId: null,
    acao: null,
    resposta: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarPropostas()
  }, [])

  async function carregarPropostas() {
    try {
      const response = await fetchWithToken(`${apiUrl}/propostas`)
      const dados = await response.json()
      setPropostas(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error("Erro ao carregar propostas:", error)
    }
  }

  function abrirModal(propostaId: number, acao: "ACEITA" | "RECUSADA") {
    setModal({
      isOpen: true,
      propostaId,
      acao,
      resposta: ""
    })
  }

  function fecharModal() {
    setModal({
      isOpen: false,
      propostaId: null,
      acao: null,
      resposta: ""
    })
  }

  async function confirmarResposta() {
    if (!modal.propostaId || !modal.acao || modal.resposta.trim().length < 3) {
      alert("Por favor, digite uma mensagem com pelo menos 3 caracteres")
      return
    }

    setLoading(true)
    try {
      const response = await fetchWithToken(`${apiUrl}/propostas/${modal.propostaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: modal.acao,
          resposta: modal.resposta
        })
      })

      if (response.ok) {
        await carregarPropostas()
        fecharModal()
      } else {
        alert("Erro ao responder proposta")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao responder proposta")
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "ACEITA":
        return "bg-green-100 text-green-800"
      case "RECUSADA":
        return "bg-red-100 text-red-800"
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "ACEITA":
        return "✓ Aceita"
      case "RECUSADA":
        return "✗ Recusada"
      case "PENDENTE":
        return "⏳ Pendente"
      default:
        return status
    }
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
        Controle de Propostas
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Carta
              </th>
              <th scope="col" className="px-6 py-3">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Proposta
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Resposta
              </th>
              <th scope="col" className="px-6 py-3">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((p) => (
              <tr key={p.id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.carta?.imagem} alt="Carta" className="w-16" />
                    <div>
                      <div className="font-semibold">{p.carta?.pokemon}</div>
                      <div className="text-xs text-gray-500">{p.carta?.colecao?.nome}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{p.cliente?.nome ?? p.clienteId}</td>
                <td className="px-6 py-4 max-w-xs truncate" title={p.descricao}>
                  {p.descricao}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                    {getStatusText(p.status)}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={p.resposta || ""}>
                  {p.resposta ? <span>{p.resposta}</span> : <i className="text-gray-400">Sem resposta</i>}
                </td>
                <td className="px-6 py-4">
                  {p.status === "PENDENTE" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(p.id, "ACEITA")}
                        className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => abrirModal(p.id, "RECUSADA")}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Recusar
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">Respondida</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">
              {modal.acao === "ACEITA" ? "✓ Aceitar Proposta" : "✗ Recusar Proposta"}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Digite uma mensagem para o cliente explicando sua decisão:
            </p>
            <textarea
              value={modal.resposta}
              onChange={(e) => setModal({ ...modal, resposta: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Sua mensagem aqui..."
              disabled={loading}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={fecharModal}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarResposta}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded ${
                  modal.acao === "ACEITA"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {loading ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

