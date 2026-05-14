import type { CartaType } from "./utils/CartaType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  descricao: string
}

export default function Detalhes() {
  const params = useParams()

  const [carta, setCarta] = useState<CartaType>()
  const { cliente } = useClienteStore()

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/cartas/${params.cartaId}`)
      const dados = await response.json()
      // console.log(dados)
      setCarta(dados)
    }
    buscaDados()
  }, [params.cartaId])

  async function enviaProposta(data: Inputs) {

    const response = await fetch(`${apiUrl}/propostas`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        clienteId: cliente.id,
        cartaId: Number(params.cartaId),
        descricao: data.descricao
      })
    })

    if (response.status == 201) {
      toast.success("Obrigado. Sua proposta foi enviada. Aguarde retorno")
      reset()
    } else {
      toast.error("Erro... Não foi possível enviar sua proposta")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#A80633] transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Início
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-slate-700 md:ml-2">Detalhes</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Imagem - Esquerda */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8 md:p-12 min-h-[400px] lg:min-h-[600px] group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              <img 
                className="relative z-10 object-contain w-full h-full max-h-[500px] drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                src={carta?.imagem} 
                alt={carta?.pokemon || "Imagem da Carta"} 
              />
            </div>

            {/* Conteúdo - Direita */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              {/* Informações da Carta */}
              <div>
                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-[#A80633] uppercase bg-red-50 rounded-full">
                  {carta?.colecao?.nome}
                </div>
                <h2 className="mb-2 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                  {carta?.pokemon}
                </h2>

                <div className="flex items-end mb-8 mt-6">
                  <span className="text-xl font-bold text-slate-400 mr-2 mb-1">R$</span>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">
                    {Number(carta?.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ano</p>
                    <p className="text-lg font-semibold text-slate-800">{carta?.ano}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Idioma</p>
                    <p className="text-lg font-semibold text-slate-800">{carta?.idioma}</p>
                  </div>
                </div>

                <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Especificações</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-slate-500 font-medium">Graduação</span>
                      <span className="font-bold text-slate-900">{carta?.graduacao}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-slate-500 font-medium">Nota</span>
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#A80633]/10 text-[#A80633] font-bold">{carta?.nota}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-slate-500 font-medium">Raridade</span>
                      <span className="font-bold text-slate-900">{carta?.raridade}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-slate-500 font-medium">Tipo</span>
                      <span className="font-bold text-slate-900">{carta?.tipo}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Formulário ou Call-to-Action */}
              <div className="mt-auto">
                {cliente.id ? (
                  <div className="bg-white p-6 rounded-2xl border-2 border-[#A80633]/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#A80633]"></div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#A80633]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Proposta
                    </h3>
                    <form onSubmit={handleSubmit(enviaProposta)} className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium text-sm rounded-xl px-4 py-3 cursor-not-allowed" 
                          value={`${cliente.nome} (${cliente.email})`} 
                          disabled 
                          readOnly 
                        />
                      </div>
                      <textarea 
                        className="w-full p-4 text-sm text-slate-900 bg-white rounded-xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] focus:outline-none resize-none transition-all"
                        placeholder="Qual é a sua proposta para esta carta?"
                        rows={3}
                        required
                        {...register("descricao")}
                      />
                      <button 
                        type="submit" 
                        className="w-full bg-[#A80633] hover:bg-[#8a0529] hover:shadow-lg hover:shadow-[#A80633]/30 text-white font-bold rounded-xl py-4 px-4 transition-all duration-300 transform active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#A80633]/50"
                      >
                        Enviar Proposta
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-8 bg-gradient-to-br from-[#A80633] to-[#8a0529] rounded-2xl shadow-lg text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="bg-white/20 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Interessado nesta carta?</h3>
                      <p className="text-white/80 mb-6 font-medium">Faça login para enviar sua proposta diretamente ao vendedor.</p>
                      <Link to="/login" className="inline-block bg-white text-[#A80633] font-bold rounded-xl px-8 py-3 hover:bg-slate-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                        Fazer Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}