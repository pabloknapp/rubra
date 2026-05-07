import { useEffect, useState } from "react"
import type { PropostaType } from "../utils/PropostaType"
import { fetchWithToken } from "./utils/fetchWithToken"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminPropostas() {
  const [propostas, setPropostas] = useState<PropostaType[]>([])

  useEffect(() => {
    async function getPropostas() {
      const response = await fetchWithToken(`${apiUrl}/propostas`)
      const dados = await response.json()
      setPropostas(Array.isArray(dados) ? dados : [])
    }
    getPropostas()
  }, [])

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
                Resposta
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
                <td className="px-6 py-4">{p.descricao}</td>
                <td className="px-6 py-4">{p.resposta ?? <i>Aguardando...</i>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

