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

type ColecaoInputs = {
  nome: string
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

  const {
    register: registerColecao,
    handleSubmit: handleSubmitColecao,
    reset: resetColecao,
  } = useForm<ColecaoInputs>()

  async function carregarColecoes() {
    const response = await fetchWithToken(`${apiUrl}/colecoes`)
    const dados = await response.json()
    setColecoes(Array.isArray(dados) ? dados : [])
  }

  useEffect(() => {
    carregarColecoes().then(() => setFocus("pokemon"))
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

  async function incluirColecao(data: ColecaoInputs) {
    const response = await fetchWithToken(`${apiUrl}/colecoes`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })

    if (response.status === 201) {
      toast.success("Ok! Coleção cadastrada com sucesso")
      resetColecao()
      carregarColecoes()
    } else {
      const erro = await response.json().catch(() => null)
      toast.error(erro?.erro?.message ?? "Erro no cadastro da Coleção...")
    }
  }

  return (
    <div className="pt-40 px-4 sm:px-6 max-w-4xl mx-auto pb-20">
      <div className="mb-6 flex items-center">
        <div className="h-8 w-1.5 bg-[#A80633] rounded-full mr-3"></div>
        <h2 className="text-2xl font-bold text-slate-900">
          Adicionar nova Coleção
        </h2>
      </div>

      <div className="mb-12 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
        <form onSubmit={handleSubmitColecao(incluirColecao)} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              id="nomeColecao"
              className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
              placeholder="Insira o nome da coleção"
              required
              {...registerColecao("nome")}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-[#A80633] hover:bg-[#8a0529] cursor-pointer focus:ring-4 focus:outline-none focus:ring-[#A80633]/50 font-bold rounded-xl text-base px-8 py-3.5 text-center transition-all duration-300 transform active:scale-[0.98]"
          >
            Adicionar Coleção
          </button>
        </form>
      </div>

      <div className="mb-6 flex items-center">
        <div className="h-8 w-1.5 bg-[#A80633] rounded-full mr-3"></div>
        <h2 className="text-2xl font-bold text-slate-900">
          Inclusão de Carta
        </h2>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
        <form onSubmit={handleSubmit(incluirCarta)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="pokemon" className="block mb-2 text-sm font-bold text-slate-700">
                Pokémon
              </label>
              <input
                type="text"
                id="pokemon"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="Ex: Charizard"
                required
                {...register("pokemon")}
              />
            </div>

            <div>
              <label htmlFor="imagem" className="block mb-2 text-sm font-bold text-slate-700">
                URL da Imagem
              </label>
              <input
                type="text"
                id="imagem"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="https://..."
                required
                {...register("imagem")}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="colecaoId" className="block mb-2 text-sm font-bold text-slate-700">
                Coleção
              </label>
              <select
                id="colecaoId"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                required
                {...register("colecaoId")}
              >
                {optionsColecao}
              </select>
            </div>
            <div>
              <label htmlFor="ano" className="block mb-2 text-sm font-bold text-slate-700">
                Ano
              </label>
              <input
                type="number"
                id="ano"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="Ex: 1999"
                required
                {...register("ano", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="preco" className="block mb-2 text-sm font-bold text-slate-700">
                Preço R$
              </label>
              <input
                type="number"
                step="0.01"
                id="preco"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="0.00"
                required
                {...register("preco", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label htmlFor="nota" className="block mb-2 text-sm font-bold text-slate-700">
                Nota (0–10)
              </label>
              <input
                type="number"
                id="nota"
                min={0}
                max={10}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                required
                {...register("nota", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="tipo" className="block mb-2 text-sm font-bold text-slate-700">
                Tipo
              </label>
              <select
                id="tipo"
                required
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
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
            <div>
              <label htmlFor="raridade" className="block mb-2 text-sm font-bold text-slate-700">
                Raridade
              </label>
              <input
                type="text"
                id="raridade"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="Ex: Holográfica"
                {...register("raridade")}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="idioma" className="block mb-2 text-sm font-bold text-slate-700">
                Idioma
              </label>
              <input
                type="text"
                id="idioma"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="Ex: Português"
                {...register("idioma")}
              />
            </div>
            <div>
              <label htmlFor="graduacao" className="block mb-2 text-sm font-bold text-slate-700">
                Graduação
              </label>
              <input
                type="text"
                id="graduacao"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                placeholder="Ex: PSA"
                {...register("graduacao")}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 w-max">
            <input
              type="checkbox"
              id="destaque"
              className="w-5 h-5 text-[#A80633] bg-white border-slate-300 rounded focus:ring-[#A80633] focus:ring-2"
              {...register("destaque")}
            />
            <label htmlFor="destaque" className="font-bold text-slate-800 cursor-pointer">
              Destacar carta na página inicial
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto text-white bg-[#A80633] hover:bg-[#8a0529] cursor-pointer focus:ring-4 focus:outline-none focus:ring-[#A80633]/50 font-bold rounded-xl text-base px-8 py-4 text-center transition-all duration-300 transform active:scale-[0.98]"
            >
              Adicionar Carta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

