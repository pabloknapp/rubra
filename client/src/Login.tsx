import { useForm } from "react-hook-form"

import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>()    
    const { login, loading, error, limpaErro } = useClienteStore()

    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        limpaErro()
        const ok = await login({ email: data.email, senha: data.senha, manter: data.manter })
        if (ok) {
            navigate("/")
        } else {
            toast.error(error ?? "Erro ao fazer login")
        }
    }

    return (
        <section className="">
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-32">
                <div className="w-full bg-white rounded-lg shadow outline-1 outline-gray-300 md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Acesse sua conta
                        </h1>
                        <form className="space-y-4 md:space-y-6" 
                           onSubmit={handleSubmit(verificaLogin)} >
                            {error ? (
                                <p className="text-sm font-semibold text-red-600">
                                    {error}
                                </p>
                            ) : null}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" id="email" 
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" 
                                       required 
                                       {...register("email")} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Senha</label>
                                <input type="password" id="password" 
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" 
                                       required 
                                       {...register("senha")} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" 
                                               aria-describedby="remember" type="checkbox" 
                                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300" 
                                               {...register("manter")} />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500">Manter Conectado</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Esqueceu sua senha?</a>
                            </div>
                            <button disabled={loading} type="submit" className="w-full text-white bg-[#A80633] hover:bg-[#A80633]/80 cursor-pointer focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60">
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                            <p className="text-sm font-light text-gray-500">
                                Ainda não possui conta? <Link to="/cadCliente" className="font-medium text-primary-600 hover:underline">Cadastre-se</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}