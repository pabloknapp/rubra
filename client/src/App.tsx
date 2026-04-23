import { CardCarta } from "./components/CardCarta";
import { InputPesquisa } from "./components/InputPesquisa";
import type { CartaType } from "./utils/CartaType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [cartas, setCartas] = useState<CartaType[]>([])

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

  const listaCartas = cartas.map(carta => (
    <CardCarta data={carta} key={carta.id} />
  ))

  return (
    <>
      <InputPesquisa setCartas={setCartas} />
      <div className="max-w-7xl mx-auto">
        <h1 className="mt-12 mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl">
          Cartas <span className="underline underline-offset-3 decoration-8 decoration-[#A80633]">em destaque</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {listaCartas}
        </div>
      </div>
    </>
  );
}
