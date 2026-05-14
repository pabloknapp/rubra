import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import './CadCliente.css'
import { useClienteStore } from "./context/ClienteContext"

// Schema Zod com validações
const schema = z.object({
    nome: z.string()
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(60, "Nome deve ter no máximo 60 caracteres")
        .refine(value => value.includes(' '), {
            message: "Informe o nome completo (nome e sobrenome)",
        }),
    email: z.email("Formato de email inválido")
        .toLowerCase(),
    senha: z.string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .regex(/[a-z]/, "Senha deve conter, no mínimo, uma letra minúscula")
        .regex(/[A-Z]/, "Senha deve conter, no mínimo, uma letra maiúscula")
        .regex(/[0-9]/, "Senha deve conter, no mínimo, um número").regex(/[A-Z]/, "Senha deve conter uma letra maiúscula")
        .regex(/[!@#$%^&*]/, "Senha deve conter, no mínimo, um caractere especial"),
    senha2: z.string()
}).refine((data) => data.senha == data.senha2, {  // Validação cross-field
    message: "Senhas não coincidem",
    path: ["senha2"]  // Erro aparece no campo senha2
})

type FormData = z.infer<typeof schema>

export default function CadCliente() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)  // Validação Zod
    });

    const navigate = useNavigate()
    const { cadastro, loading, error, limpaErro } = useClienteStore()

    async function cadastraCliente(data: FormData) {
        limpaErro()
        const ok = await cadastro({ nome: data.nome, email: data.email, senha: data.senha })
        if (ok) {
            toast.success("Ok! Cadastro realizado com sucesso...")
            // carrega a página principal, após login do cliente
            setTimeout(() => {
                navigate("/login")
            }, 3000)  // Aguarda 3 segundos (3000 ms)
        } else {
            if (error === "E-mail já cadastrado") {
                setError("email", { type: "server", message: error })
                toast.error(error)
                return
            }
            // Outros erros genéricos
            toast.error(error ?? "Erro ao cadastrar")
        }

    }

    return (
        <section className="min-h-[90vh] flex flex-col justify-center bg-slate-50/50 py-12 px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center mx-auto w-full max-w-md">
                <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A80633] to-red-500"></div>
                    <div className="p-8 sm:p-10 space-y-6">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                Crie sua conta
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Junte-se a nós para encontrar as melhores cartas.</p>
                        </div>
                        <form className="space-y-5" onSubmit={handleSubmit(cadastraCliente)}>
                            {error ? (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm font-semibold text-red-700">{error}</p>
                                </div>
                            ) : null}
                            
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-bold text-slate-700">Nome Completo</label>
                                <input type="text" id="nome" 
                                       className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm" 
                                       placeholder="Seu nome e sobrenome" 
                                       required
                                       {...register("nome")} />
                                {errors.nome && <p role="alert" className="mt-2 text-xs font-semibold text-red-500">{errors.nome.message}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-bold text-slate-700">E-mail</label>
                                <input type="email" id="email" 
                                       className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm" 
                                       placeholder="exemplo@email.com" 
                                       required
                                       {...register("email")} />
                                {errors.email && <p role="alert" className="mt-2 text-xs font-semibold text-red-500">{errors.email.message}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-bold text-slate-700">Senha</label>
                                <input type="password" id="password" 
                                       placeholder="••••••••" 
                                       className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm" 
                                       required
                                       {...register("senha")} />
                                {errors.senha && <p role="alert" className="mt-2 text-xs font-semibold text-red-500">{errors.senha.message}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-bold text-slate-700">Confirme sua Senha</label>
                                <input type="password" id="confirm-password" 
                                       placeholder="••••••••" 
                                       className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-[#A80633]/20 focus:border-[#A80633] block w-full p-3.5 transition-all outline-none shadow-sm" 
                                       required
                                       {...register("senha2")} />
                                {errors.senha2 && <p role="alert" className="mt-2 text-xs font-semibold text-red-500">{errors.senha2.message}</p>}
                            </div>
                            
                            <button disabled={loading} type="submit" className="w-full text-white bg-[#A80633] hover:bg-[#8a0529] hover:shadow-lg hover:shadow-[#A80633]/30 cursor-pointer focus:ring-4 focus:outline-none focus:ring-[#A80633]/50 font-bold rounded-xl text-base px-5 py-4 text-center disabled:opacity-60 transition-all duration-300 transform active:scale-[0.98] mt-6">
                                {loading ? "Cadastrando..." : "Criar sua Conta"}
                            </button>
                            
                            <p className="text-sm font-medium text-slate-500 text-center mt-6">
                                Já possui uma conta? <Link to="/login" className="font-bold text-[#A80633] hover:text-[#8a0529] hover:underline transition-colors">Faça Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}