import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CartaType } from "../utils/CartaType";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setCartas: React.Dispatch<React.SetStateAction<CartaType[]>>
}

export function InputPesquisa({ setCartas }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {
        // alert(data.termo)
        if (data.termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        try {
            const response = await fetch(`${apiUrl}/cartas/pesquisa/${data.termo}`)
            const dados = await response.json()
            if (Array.isArray(dados)) {
                setCartas(dados)
            } else {
                setCartas([])
                toast.error("Erro ao pesquisar (resposta inválida da API).")
                console.error("Resposta inválida /cartas/pesquisa:", dados)
            }
        } catch (error) {
            setCartas([])
            toast.error("Erro ao pesquisar. Verifique se a API está no ar.")
            console.error(error)
        }
    }

    async function mostraDestaques() {
        try {
            const response = await fetch(`${apiUrl}/cartas/destaques`)
            const dados = await response.json()
            reset({ termo: "" })
            if (Array.isArray(dados)) {
                setCartas(dados)
            } else {
                setCartas([])
                toast.error("Erro ao carregar destaques (resposta inválida da API).")
                console.error("Resposta inválida /cartas/destaques:", dados)
            }
        } catch (error) {
            setCartas([])
            toast.error("Erro ao carregar destaques. Verifique se a API está no ar.")
            console.error(error)
        }
    }

    return (
        <div className="flex mx-auto max-w-5xl my-12">
            <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="Pesquise por nome, coleção, ano ou preço máximo do Pokémon" required 
                        {...register('termo')} />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#A80633] hover:bg-[#A80633]/80 hover:cursor-pointer font-medium rounded-lg text-sm px-4 py-2">
                        Pesquisar
                    </button>
                </div>
            </form>
            <button type="button" className="ms-3 mt-2 text-[#A80633] outline hover:bg-[#A80633]/90 hover:text-white hover:cursor-pointer font-medium rounded-full text-sm px-5 py-2 mb-2"
                    onClick={mostraDestaques}>
                Ver Destaques
            </button>
        </div>
    )
}