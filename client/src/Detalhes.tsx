import type { CartaType } from "./utils/CartaType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

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
  }, [])

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
    <>
      <section className="flex my-35 mx-auto flex-col items-center bg-gray-50 border border-gray-300 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100">
        <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
          src={carta?.imagem} alt="Imagem da Carta" />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {carta?.pokemon} <span className="text-gray-400 font-semibold">({carta?.colecao?.nome})</span>
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900">
            Ano: {carta?.ano} - Idioma: {carta?.idioma}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900">
            Preço R$: {Number(carta?.preco)
              .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </h5>
          <p className="mb-3 font-normal text-gray-700">
            Tipo: {carta?.tipo} • Raridade: {carta?.raridade} • Nota: {carta?.nota} • Graduação: {carta?.graduacao}
          </p>
          {cliente.id ?
            <>
              <h3 className="text-xl font-bold tracking-tight pt-12 text-gray-900">
                Envie sua proposta</h3>
              <form onSubmit={handleSubmit(enviaProposta)}>
                <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={`${cliente.nome} (${cliente.email})`} disabled readOnly />
                <textarea id="message" className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva a sua proposta"
                  required
                  {...register("descricao")}>
                </textarea>
                <button type="submit" className="text-white bg-[#A80633] hover:bg-[#A80633]/90 focus:ring-4 focus:outline-none focus:ring-[#A80633]/80 font-medium rounded-lg text-sm w-full sm:w-auto my-6 px-5 py-2 text-center">Enviar proposta</button>
              </form>
            </>
            :
            <h2 className="mb-2 text-xl tracking-tight text-gray-900">
              Interessado na carta? Faça login e envie sua Proposta!
            </h2>
          }
        </div>
      </section>
    </>
  )
}