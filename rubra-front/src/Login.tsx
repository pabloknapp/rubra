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
        <section className="min-h-[80vh] flex flex-col justify-center bg-slate-50/50 py-12 px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center mx-auto w-full max-w-md">
                <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A80633] to-red-500"></div>
                    <div className="p-8 sm:p-10 space-y-6">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                Acesse sua conta
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Bem-vindo de volta! Por favor, insira seus dados.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
                            {error ? (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm font-semibold text-red-700">{error}</p>
                                </div>
                            ) : null}

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-bold text-slate-700">Email</label>
                                <input type="email" id="email"
                                    className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                                    placeholder="exemplo@email.com"
                                    required
                                    {...register("email")} />
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-bold text-slate-700">Senha</label>
                                <input type="password" id="password"
                                    className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm"
                                    placeholder="••••••••"
                                    required
                                    {...register("senha")} />
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center">
                                    <input id="remember"
                                        type="checkbox"
                                        className="w-4 h-4 text-[#A80633] bg-slate-50 border-slate-300 rounded focus:ring-[#A80633] focus:ring-2 cursor-pointer"
                                        {...register("manter")} />
                                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600 cursor-pointer">Lembrar-me</label>
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="w-full text-white bg-[#A80633] hover:bg-[#8a0529] cursor-pointer focus:ring-4 focus:outline-none focus:ring-[#A80633]/50 font-bold rounded-xl text-base px-5 py-4 text-center disabled:opacity-60 transition-all duration-300 transform active:scale-[0.98] mt-4">
                                {loading ? "Entrando..." : "Entrar"}
                            </button>

                            <p className="text-sm font-medium text-slate-500 text-center mt-6">
                                Ainda não possui conta? <Link to="/cadCliente" className="font-bold text-[#A80633] hover:text-[#8a0529] hover:underline transition-colors">Cadastre-se</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}