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
        const err = await response.json().catch(() => null)
        alert(`Erro ao responder proposta: ${err?.erro || err?.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro de conexão ao responder proposta")
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
    <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="h-10 w-2 bg-slate-900 rounded-full mr-4"></div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Controle de Propostas
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Carta</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Proposta</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Status</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Resposta</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {propostas.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-slate-50 rounded flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                        <img src={p.carta?.imagem} alt="Carta" className="object-contain h-full p-1" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{p.carta?.pokemon}</div>
                        <div className="text-xs font-semibold text-[#A80633] bg-red-50 inline-block px-1.5 py-0.5 rounded mt-1">{p.carta?.colecao?.nome}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{p.cliente?.nome ?? p.clienteId}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2" title={p.descricao}>
                      {p.descricao}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${getStatusColor(p.status)}`}>
                      {getStatusText(p.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {p.resposta ? (
                      <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2" title={p.resposta}>
                        {p.resposta}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs font-medium">Sem resposta</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {p.status === "PENDENTE" ? (
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <button
                          onClick={() => abrirModal(p.id, "ACEITA")}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 hover:cursor-pointer hover:shadow-md transition-all active:scale-95"
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={() => abrirModal(p.id, "RECUSADA")}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#A80633] rounded-lg hover:bg-[#A80633]/70 hover:cursor-pointer hover:shadow-md transition-all active:scale-95"
                        >
                          Recusar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">Respondida</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className={`absolute top-0 left-0 w-full h-2 ${modal.acao === "ACEITA" ? "bg-green-500" : "bg-red-500"}`}></div>

            <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
              {modal.acao === "ACEITA" ? (
                <>Aceitar Proposta</>
              ) : (
                <>Recusar Proposta</>
              )}
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-6">
              Digite uma mensagem para o cliente explicando sua decisão. Ela será visível no painel dele.
            </p>

            <textarea
              value={modal.resposta}
              onChange={(e) => setModal({ ...modal, resposta: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 resize-none transition-all shadow-sm"
              rows={4}
              placeholder="Sua mensagem aqui..."
              disabled={loading}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={fecharModal}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarResposta}
                disabled={loading}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-[0.98] ${modal.acao === "ACEITA"
                  ? "bg-green-600 hover:bg-green-700 hover:shadow-green-600/30"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-red-600/30"
                  } disabled:opacity-50 disabled:active:scale-100`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  "Confirmar Envio"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

