import { Link } from "react-router-dom"
import type { CartaType } from "../utils/CartaType"

export function CardCarta({ data }: { data: CartaType }) {
  return (
    <div className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden h-52 sm:h-60 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <img
          className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500 ease-out"
          src={data.imagem}
          alt={data.pokemon}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      <div className="flex flex-col flex-grow p-5 sm:p-6">
        <div className="flex-grow">
          <h5 className="mb-1 text-lg sm:text-xl font-bold tracking-tight text-slate-900 line-clamp-2 group-hover:text-[#A80633] transition-colors duration-200">
            {data.pokemon}
          </h5>
          <p className="mb-4 text-xs sm:text-sm text-slate-500 font-medium bg-slate-100 inline-block px-2.5 py-1 rounded-md">
            {data.colecao?.nome}
          </p>
          <div className="flex items-end mb-4">
            <span className="text-sm font-semibold text-slate-500 mr-1">R$</span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {Number(data.preco).toLocaleString("pt-br", {
                minimumFractionDigits: 2
              })}
            </p>
          </div>
        </div>
        <Link
          to={`/detalhes/${data.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-[#A80633] rounded-xl hover:bg-[#8a0529] transition-all duration-300 focus:ring-4 focus:outline-none focus:ring-[#A80633]/50"
        >
          Ver Detalhes
          <svg className="w-4 h-4 ms-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

