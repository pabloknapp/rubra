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
    <div className="m-4 mt-24">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
          Cadastro de Cartas
        </h1>
        <Link
          to="/admin/cartas/nova"
          className="text-white bg-[#A80633] hover:bg-[#A80633]/90 focus:ring-4 focus:ring-[#A80633]/30 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 focus:outline-none"
        >
          Nova Carta
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Imagem
              </th>
              <th scope="col" className="px-6 py-3">
                Pokémon
              </th>
              <th scope="col" className="px-6 py-3">
                Coleção
              </th>
              <th scope="col" className="px-6 py-3">
                Ano
              </th>
              <th scope="col" className="px-6 py-3">
                Preço R$
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {cartas.map((c) => (
              <ItemCarta key={c.id} carta={c} cartas={cartas} setCartas={setCartas} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

