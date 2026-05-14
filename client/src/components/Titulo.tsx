import { Link } from "react-router-dom"
import { useClienteStore } from "../context/ClienteContext"
import { useNavigate } from "react-router-dom"

export default function Titulo() {
    const { cliente, deslogaCliente } = useClienteStore()
    const navigate = useNavigate()

    function clienteSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaCliente()
            navigate("/login")
        }
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-3 px-4 md:px-6">
                <Link to="/" className="flex items-center space-x-3 group">
                    <img src="./rubra-logo.png" className="w-9 transition-transform duration-300 group-hover:scale-110" alt="Logo Rubra" />
                    <p className="text-2xl font-black tracking-tight text-[#A80633]">
                        RUBRA
                    </p>
                </Link>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent items-center">
                        <li>
                            {cliente.id ?
                                <div className="flex items-center gap-6">
                                    <span className="text-slate-700 flex items-center gap-2 font-medium transition-all duration-300 rounded-full p-2 hover:bg-slate-100">
                                        <img src="./user.png" alt="" className="size-4" /> Bem-vindo, <span className="font-bold text-slate-900">{cliente.nome}</span>
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <Link to="/minhasPropostas" className="text-white font-semibold bg-[#A80633] hover:bg-[#8a0529] transition-all duration-300 rounded-xl text-sm px-5 py-2.5 text-center">
                                            Minhas Propostas
                                        </Link>
                                        <button className="cursor-pointer font-semibold bg-white border border-slate-200 text-slate-700 hover:text-[#A80633] hover:border-[#A80633]/30 hover:bg-red-50 hover:shadow-sm transition-all duration-300 rounded-xl text-sm px-5 py-2.5 text-center"
                                            onClick={clienteSair}>
                                            Sair
                                        </button>
                                    </div>
                                </div>
                                :
                                <Link to="/login" className="flex items-center justify-center gap-2 px-6 py-2.5 text-slate-700 font-semibold bg-white border border-slate-600 hover:bg-[#A80633]/5 hover:border-[#A80633] hover: border-1.5 transition-all duration-300 rounded-xl shadow-sm">
                                    <img src="./user.png" alt="Usuario" className="h-4 opacity-70" />
                                    <span>Entrar</span>
                                </Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}