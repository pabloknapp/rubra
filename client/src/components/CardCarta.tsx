import { Link } from "react-router-dom"
import type { CartaType } from "../utils/CartaType"

export function CardCarta({ data }: { data: CartaType }) {
  return (
    <div className="max-w-xs bg-white border border-gray-300 rounded-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative overflow-hidden h-48 sm:h-52 bg-gray-100 flex items-center justify-center">
        <img 
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
          src={data.imagem} 
          alt={data.pokemon} 
        />
      </div>
      <div className="p-4 sm:p-5">
        <h5 className="mb-1 text-lg sm:text-xl font-bold tracking-tight text-gray-900 line-clamp-2">
          {data.pokemon}
        </h5>
        <p className="mb-4 text-xs sm:text-sm text-gray-600 font-medium">
          ({data.colecao?.nome})
        </p>
        <p className="mb-4 text-sm sm:text-base font-bold text-gray-800">
          R$ {Number(data.preco).toLocaleString("pt-br", {
            minimumFractionDigits: 2
          })}
        </p>
        <Link
          to={`/detalhes/${data.id}`}
          className="inline-flex items-center justify-center w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#A80633] rounded-lg hover:bg-[#A80633]/90"
        >
          Ver Detalhes
          <svg className="w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

