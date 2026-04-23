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
        <nav className="bg-gray-100 border border-gray-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4">
                <Link to="/" className="flex items-center space-x-3">
                    <img src="./rubra-logo.png" className="w-8" alt="Logo Rubra" />
                    <p className="text-2xl font-bold text-[#A80633]">
                        RUBRA CARDS
                    </p>
                </Link>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            {cliente.id ?
                                <>
                                    <div className="flex items-center">
                                        <span className="text-gray-600 font-semibold px-6">
                                            Bem vindo, {cliente.nome}
                                        </span>&nbsp;&nbsp;
                                        <div className="flex items-center">
                                            <Link to="/minhasPropostas" className="text-white font-bold bg-[#A80633] hover:bg-[#A80633]/90 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center">
                                                Minhas Propostas
                                            </Link>&nbsp;&nbsp;
                                            <p className="cursor-pointer font-bold outline -outline-offset-2 hover:outline-[#A80633]/90 rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center text-gray-900 hover:text-[#A80633]"
                                                onClick={clienteSair}>
                                                Sair
                                            </p>
                                        </div>
                                    </div>
                                </>
                                :
                                <p className="md:px-6 md:py-2 text-gray-900 rounded-sm outline hover:outline-2 hover:font-bold hover:bg-gray md:hover:bg-transparent md:border-0 ">
                                    <Link to="/login" className="flex items-center justify-center gap-2">
                                        <img src="./user.png" alt="Usuario"  className="h-3.5"/>
                                        <p>Entrar</p>
                                    </Link>
                                </p>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}