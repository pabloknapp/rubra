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
      <section className="my-8 mx-auto max-w-6xl px-4">
        <div className="bg-white rounded-2xl outline-2 outline-gray-300 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Imagem - Esquerda */}
            <div className="bg-gray-50 flex items-center justify-center p-6 min-h-96">
              <img 
                className="object-contain max-w-full max-h-96 hover:scale-105 transition-transform duration-300"
                src={carta?.imagem} 
                alt="Imagem da Carta" 
              />
            </div>

            {/* Conteúdo - Direita */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              {/* Informações da Carta */}
              <div>
                <h2 className="mb-1 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                  {carta?.pokemon}
                </h2>
                <p className="mb-6 text-sm md:text-base text-gray-500 font-semibold">
                  {carta?.colecao?.nome}
                </p>

                <div className="mb-6 space-y-2">
                  <div className="flex gap-4 text-sm md:text-base text-gray-700">
                    <span className="font-semibold">ANO</span>
                    <span>{carta?.ano}</span>
                  </div>
                  <div className="flex gap-4 text-sm md:text-base text-gray-700">
                    <span className="font-semibold">IDIOMA</span>
                    <span>{carta?.idioma}</span>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl outline-1 outline-gray-400">
                  <p className="text-sm md:text-base text-gray-700 space-y-2">
                    <span className="block"><strong>Graduação:</strong> {carta?.graduacao}</span>
                    <span className="block"><strong>Nota:</strong> {carta?.nota}</span>
                    <span className="block"><strong>Raridade:</strong> {carta?.raridade}</span>
                    <span className="block"><strong>Tipo:</strong> {carta?.tipo}</span>
                  </p>
                </div>
              </div>

              <p className="mb-6 text-2xl md:text-3xl font-bold text-[#A80633]">
                R$ {Number(carta?.preco)
                  .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
              </p>

              {/* Formulário ou Call-to-Action */}
              <div>
                {cliente.id ? (
                  <>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                      Envie sua proposta
                    </h3>
                    <form onSubmit={handleSubmit(enviaProposta)} className="space-y-4">
                      <input 
                        type="text" 
                        className="w-full bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg px-4 py-3 cursor-not-allowed" 
                        value={`${cliente.nome} (${cliente.email})`} 
                        disabled 
                        readOnly 
                      />
                      <textarea 
                        className="w-full p-4 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#A80633] focus:border-[#A80633] focus:outline-none resize-none"
                        placeholder="Descreva a sua proposta"
                        rows={4}
                        required
                        {...register("descricao")}
                      />
                      <button 
                        type="submit" 
                        className="w-full bg-[#A80633] hover:bg-[#A80633] text-white font-semibold rounded-lg py-3 px-4 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#A80633] focus:ring-offset-2"
                      >
                        Enviar proposta
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-6 bg-[#A80633]/5 rounded-xl border-2 border-[#A80633]/70">
                    <p className="text-lg text-gray-800 font-semibold">
                      Interessado na carta? <Link to="/login" className="text-[#A80633] hover:underline">Faça login</Link> e envie sua proposta!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}