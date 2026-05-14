import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { CartaType } from "../utils/CartaType"
import ItemCarta from "./components/ItemCarta"
import { fetchWithToken } from "./utils/fetchWithToken"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminCartas() {
  const [cartas, setCartas] = useState<CartaType[]>([])

  useEffect(() => {
    async function getCartas() {
      const response = await fetchWithToken(`${apiUrl}/cartas`)
      const dados = await response.json()
      setCartas(Array.isArray(dados) ? dados : [])
    }
    getCartas()
  }, [])

  return (
    <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <div className="h-10 w-2 bg-slate-900 rounded-full mr-4"></div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Cadastro de Cartas
          </h1>
        </div>
        <Link
          to="/admin/cartas/nova"
          className="inline-flex items-center text-white bg-[#A80633] hover:bg-[#8a0529] transition-all duration-300 font-bold rounded-xl text-base px-6 py-3"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Carta
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Imagem</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Pokémon</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Coleção</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Ano</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Preço R$</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cartas.map((c) => (
                <ItemCarta key={c.id} carta={c} cartas={cartas} setCartas={setCartas} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

