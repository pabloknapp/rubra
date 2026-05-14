import { CardCarta } from "./components/CardCarta";
import { InputPesquisa } from "./components/InputPesquisa";
import type { CartaType } from "./utils/CartaType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [cartas, setCartas] = useState<CartaType[]>([])
  const [todasCartas, setTodasCartas] = useState<CartaType[]>([])
  const [isPesquisa, setIsPesquisa] = useState(false)

  useEffect(() => {
    async function buscaDados() {
      try {
        const response = await fetch(`${apiUrl}/cartas/destaques`)
        const dados = await response.json()
        if (Array.isArray(dados)) {
          setCartas(dados)
        } else {
          setCartas([])
          toast.error("Erro ao carregar cartas (resposta inválida da API). Verifique VITE_API_URL e o backend.")
          console.error("Resposta inválida /cartas/destaques:", dados)
        }
      } catch (error) {
        setCartas([])
        toast.error("Erro ao carregar cartas. Verifique se a API está no ar.")
        console.error(error)
      }
    }
    buscaDados()
  }, [])

  useEffect(() => {
    async function buscaTodasCartas() {
      try {
        const response = await fetch(`${apiUrl}/cartas`)
        const dados = await response.json()
        if (Array.isArray(dados)) {
          setTodasCartas(dados)
        } else {
          setTodasCartas([])
          toast.error("Erro ao carregar todas as cartas.")
          console.error("Resposta inválida /cartas:", dados)
        }
      } catch (error) {
        setTodasCartas([])
        toast.error("Erro ao carregar todas as cartas.")
        console.error(error)
      }
    }
    buscaTodasCartas()
  }, [])

  const listaCartas = cartas.map(carta => (
    <CardCarta data={carta} key={carta.id} />
  ))

  const listaTodasCartas = todasCartas.map(carta => (
    <CardCarta data={carta} key={carta.id} />
  ))

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <InputPesquisa setCartas={setCartas} setIsPesquisa={setIsPesquisa} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isPesquisa ? (
          <>
            <div className="flex items-center mb-8">
              <div className="h-10 w-2 bg-[#A80633] rounded-full mr-4"></div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Resultados da Pesquisa
              </h2>
            </div>

            {cartas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-slate-500 font-medium">Nenhum resultado encontrado para sua pesquisa.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                {listaCartas}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center mb-8">
              <div className="h-10 w-2 bg-[#A80633] rounded-full mr-4"></div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Cartas em Destaque
              </h2>
            </div>

            {cartas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-slate-500 font-medium">Nenhuma carta encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {listaCartas}
              </div>
            )}

            <div className="mt-24 mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Todas as cartas
                </h2>
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                  {todasCartas.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
              {listaTodasCartas}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

