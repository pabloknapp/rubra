import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import { useNavigate } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  email: string
  senha: string
}

type LoginResponse = {
  id: string
  nome: string
  email: string
  token: string
  nivel: number
}

export default function AdminLogin() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const navigate = useNavigate()
  const { logaAdmin } = useAdminStore()

  useEffect(() => {
    setFocus("email")
  }, [setFocus])

  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${apiUrl}/admins/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: data.email, senha: data.senha }),
    })

    if (response.ok) {
      const payload = (await response.json()) as LoginResponse
      logaAdmin(payload)
      navigate("/admin", { replace: true })
      return
    }

    const erro = await response.json().catch(() => null)
    toast.error(erro?.erro ?? "Erro... Login ou senha incorretos")
  }

  return (
    <main className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center mx-auto w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
            <img src="/rubra-logo.png" alt="Rubra" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#A80633]">
            PAINEL ADMIN
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Área administrativa</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#A80633]"></div>
          <div className="p-8 sm:p-10 space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-bold text-slate-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 block w-full p-3.5 transition-all outline-none shadow-sm"
                  placeholder="exemplo@email.com"
                  {...register("email")}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-bold text-slate-700">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:border-slate-900 block w-full p-3.5 transition-all outline-none shadow-sm"
                  placeholder="••••••••"
                  {...register("senha")}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#A80633] hover:bg-shadow-lg cursor-pointer font-bold rounded-xl text-base px-5 py-4 text-center transition-all duration-300 transform active:scale-[0.98] mt-6"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  )
}

