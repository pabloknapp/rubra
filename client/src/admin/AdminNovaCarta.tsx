import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { ColecaoType } from "../utils/ColecaoType"
import { fetchWithToken } from "./utils/fetchWithToken"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  imagem: string
  pokemon: string
  tipo: string
  graduacao: string
  nota: number
  idioma: string
  ano: number
  raridade: string
  preco: number
  destaque: boolean
  colecaoId: number
}

export default function AdminNovaCarta() {
  const [colecoes, setColecoes] = useState<ColecaoType[]>([])

  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>({
    defaultValues: {
      tipo: "NORMAL",
      graduacao: "OUTRO",
      idioma: "PORTUGUES",
      raridade: "COMMON",
      destaque: true,
    },
  })

  useEffect(() => {
    async function carregar() {
      const response = await fetchWithToken(`${apiUrl}/colecoes`)
      const dados = await response.json()
      setColecoes(Array.isArray(dados) ? dados : [])
      setFocus("pokemon")
    }
    carregar()
  }, [setFocus])

  const optionsColecao = useMemo(
    () => colecoes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>),
    [colecoes],
  )

  async function incluirCarta(data: Inputs) {
    const payload: Inputs = {
      ...data,
      nota: Number(data.nota),
      ano: Number(data.ano),
      preco: Number(data.preco),
      colecaoId: Number(data.colecaoId),
      destaque: Boolean(data.destaque),
    }

    const response = await fetchWithToken(`${apiUrl}/cartas`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (response.status === 201) {
      toast.success("Ok! Carta cadastrada com sucesso")
      reset()
    } else {
      const erro = await response.json().catch(() => null)
      toast.error(erro?.erro?.message ?? "Erro no cadastro da Carta...")
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
        Inclusão de Carta
      </h1>

      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirCarta)}>
        <div className="mb-3">
          <label htmlFor="pokemon" className="block mb-2 text-sm font-medium text-gray-900">
            Pokémon
          </label>
          <input
            type="text"
            id="pokemon"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
            required
            {...register("pokemon")}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imagem" className="block mb-2 text-sm font-medium text-gray-900">
            URL da Imagem
          </label>
          <input
            type="text"
            id="imagem"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
            required
            {...register("imagem")}
          />
        </div>

        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="colecaoId" className="block mb-2 text-sm font-medium text-gray-900">
              Coleção
            </label>
            <select
              id="colecaoId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              required
              {...register("colecaoId")}
            >
              {optionsColecao}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ano" className="block mb-2 text-sm font-medium text-gray-900">
              Ano
            </label>
            <input
              type="number"
              id="ano"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              required
              {...register("ano", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900">
              Preço R$
            </label>
            <input
              type="number"
              step="0.01"
              id="preco"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              required
              {...register("preco", { valueAsNumber: true })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nota" className="block mb-2 text-sm font-medium text-gray-900">
              Nota (0–10)
            </label>
            <input
              type="number"
              id="nota"
              min={0}
              max={10}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              required
              {...register("nota", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-900">
              Tipo
            </label>
            <select
              id="tipo"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              {...register("tipo")}
            >
              <option value="NORMAL">Normal</option>
              <option value="FOGO">Fogo</option>
              <option value="AGUA">Água</option>
              <option value="ELETRICO">Elétrico</option>
              <option value="GRAMA">Grama</option>
              <option value="GELO">Gelo</option>
              <option value="LUTADOR">Lutador</option>
              <option value="VENENO">Veneno</option>
              <option value="TERRA">Terra</option>
              <option value="VOADOR">Voador</option>
              <option value="PSIQUICO">Psíquico</option>
              <option value="INSETO">Inseto</option>
              <option value="PEDRA">Pedra</option>
              <option value="FANTASMA">Fantasma</option>
              <option value="DRAGAO">Dragão</option>
              <option value="SOMBRIO">Sombrio</option>
              <option value="ACO">Aço</option>
              <option value="FADA">Fada</option>
              <option value="ESTELAR">Estelar</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="raridade" className="block mb-2 text-sm font-medium text-gray-900">
              Raridade
            </label>
            <input
              type="text"
              id="raridade"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              {...register("raridade")}
            />
          </div>
        </div>

        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="idioma" className="block mb-2 text-sm font-medium text-gray-900">
              Idioma
            </label>
            <input
              type="text"
              id="idioma"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              {...register("idioma")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="graduacao" className="block mb-2 text-sm font-medium text-gray-900">
              Graduação
            </label>
            <input
              type="text"
              id="graduacao"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              {...register("graduacao")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <input type="checkbox" id="destaque" className="w-4 h-4" {...register("destaque")} />
          <label htmlFor="destaque" className="text-sm font-medium text-gray-900">
            Destaque
          </label>
        </div>

        <button
          type="submit"
          className="text-white bg-[#A80633] hover:bg-[#A80633]/90 focus:ring-4 focus:outline-none focus:ring-[#A80633]/30 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Incluir
        </button>
      </form>
    </>
  )
}

