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
        <section className="">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-32 lg:py-0">
                <div className="w-full bg-white rounded-lg outline-1 outline-gray-300 shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Crie sua conta
                        </h1>
                        <form className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit(cadastraCliente)}>
                            {error ? (
                                <p className="text-sm font-semibold text-red-600">
                                    {error}
                                </p>
                            ) : null}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Nome:</label>
                                <input type="text" id="nome" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" placeholder="Seu nome completo" required
                                    {...register("nome")} />
                                {errors.nome && <p role="alert" className="error">{errors.nome.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">E-mail:</label>
                                <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" placeholder="nome@gmail.com" required
                                    {...register("email")} />
                                {errors.email && <p role="alert" className="error">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Senha:</label>
                                <input type="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" required
                                    {...register("senha")} />
                                {errors.senha && <p role="alert" className="error">{errors.senha.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirme sua Senha:</label>
                                <input type="password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" required
                                    {...register("senha2")} />
                                {errors.senha2 && <p role="alert" className="error">{errors.senha2.message}</p>}
                            </div>
                            <button disabled={loading} type="submit" className="w-full text-white bg-[#A80633] hover:bg-[#A80633]/90 focus:ring-4 cursor-pointer font-medium rounded-lg text-sm px-5 py-2 text-center disabled:opacity-60">
                                {loading ? "Cadastrando..." : "Criar sua Conta"}
                            </button>
                            <p className="text-sm font-light text-gray-500">
                                Já possui uma conta? <Link to="/login" className="font-medium text-primary-600 hover:underline">Faça Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}