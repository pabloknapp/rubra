import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"
import type { CartaType } from "../../utils/CartaType"
import { fetchWithToken } from "../utils/fetchWithToken"

type ListaCartaProps = {
  carta: CartaType
  cartas: CartaType[]
  setCartas: React.Dispatch<React.SetStateAction<CartaType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemCarta({ carta, cartas, setCartas }: ListaCartaProps) {
  async function excluirCarta() {
    if (confirm(`Confirma a exclusão da carta "${carta.pokemon}"?`)) {
      const response = await fetchWithToken(`${apiUrl}/cartas/${carta.id}`, { method: "DELETE" })
      if (response.ok) {
        setCartas(cartas.filter((x) => x.id !== carta.id))
      } else {
        alert("Erro... Carta não foi excluída")
      }
    }
  }

  async function alterarDestaque() {
    // o backend usa PUT com validação completa, então reenviamos todos os campos obrigatórios
    const payload = {
      imagem: carta.imagem,
      pokemon: carta.pokemon,
      tipo: carta.tipo,
      graduacao: carta.graduacao,
      nota: carta.nota,
      idioma: carta.idioma,
      ano: carta.ano,
      raridade: carta.raridade,
      preco: Number(carta.preco),
      destaque: !carta.destaque,
      colecaoId: carta.colecaoId,
    }

    const response = await fetchWithToken(`${apiUrl}/cartas/${carta.id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      setCartas(
        cartas.map((x) => (x.id === carta.id ? { ...x, destaque: payload.destaque } : x)),
      )
    } else {
      alert("Erro... Não foi possível alterar o destaque")
    }
  }

  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        <img src={carta.imagem} alt={`Carta ${carta.pokemon}`} style={{ width: 120 }} />
      </th>
      <td className={`px-6 py-4 ${carta.destaque ? "font-extrabold" : ""}`}>{carta.pokemon}</td>
      <td className={`px-6 py-4 ${carta.destaque ? "font-extrabold" : ""}`}>{carta.colecao?.nome}</td>
      <td className={`px-6 py-4 ${carta.destaque ? "font-extrabold" : ""}`}>{carta.ano}</td>
      <td className={`px-6 py-4 ${carta.destaque ? "font-extrabold" : ""}`}>
        {Number(carta.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-3xl text-red-600 inline-block cursor-pointer"
          title="Excluir"
          onClick={excluirCarta}
        />
        &nbsp;
        <FaRegStar
          className="text-2xl text-yellow-600 inline-block cursor-pointer"
          title="Destacar"
          onClick={alterarDestaque}
        />
      </td>
    </tr>
  )
}

