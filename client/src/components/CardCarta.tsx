import { Link } from "react-router-dom"
import type { CartaType } from "../utils/CartaType"

export function CardCarta({ data }: { data: CartaType }) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
      <img className="rounded-t-lg" src={data.imagem} alt="Imagem" />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {data.pokemon} <span className="text-gray-500 font-semibold">({data.colecao?.nome})</span>
        </h5>
        <p className="mb-3 font-extrabold text-gray-700">
          Preço R$: {Number(data.preco).toLocaleString("pt-br", {
            minimumFractionDigits: 2
          })}
        </p>
        <p className="mb-3 font-normal text-gray-800">
          {data.ano} - {data.raridade}
        </p>
        <Link
          to={`/detalhes/${data.id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#A80633] rounded-lg hover:bg-[#A80633]/80 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Ver Detalhes
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

