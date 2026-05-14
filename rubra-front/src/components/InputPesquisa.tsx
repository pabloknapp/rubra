import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CartaType } from "../utils/CartaType";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setCartas: React.Dispatch<React.SetStateAction<CartaType[]>>
    setIsPesquisa: React.Dispatch<React.SetStateAction<boolean>>
}

export function InputPesquisa({ setCartas, setIsPesquisa }: InputPesquisaProps) {
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
                setIsPesquisa(true)
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
                setIsPesquisa(false)
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
        <div className="flex flex-col sm:flex-row items-center gap-4 mx-auto max-w-4xl my-16 px-4">
            <form className="flex-1 w-full" onSubmit={handleSubmit(enviaPesquisa)}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-slate-900 sr-only">Pesquisar</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-[#A80633] transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input 
                        type="search" 
                        id="default-search" 
                        className="block w-full p-5 ps-14 text-base text-slate-900 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] transition-all outline-none"
                        placeholder="Pesquise por nome, coleção, ano ou preço..." 
                        required 
                        {...register('termo')} 
                    />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#A80633] hover:bg-[#8a0529] hover:shadow-lg transition-all duration-300 font-semibold rounded-xl text-sm px-6 py-3">
                        Pesquisar
                    </button>
                </div>
            </form>
            <button type="button" className="w-full sm:w-auto text-[#A80633] bg-white border-2 border-[#A80633]/20 hover:border-[#A80633] hover:bg-red-50 hover:shadow-md transition-all duration-300 font-bold rounded-2xl text-sm px-8 py-5"
                    onClick={mostraDestaques}>
                Ver Destaques
            </button>
        </div>
    )
}