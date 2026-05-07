import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import { useNavigate } from "react-router-dom"
import type { AdminType } from "../utils/AdminType"

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
    <main className="max-w-screen-xl flex flex-col items-center mx-auto p-6 pt-24">
      <img src="/rubra-logo.png" alt="Rubra" style={{ width: 200 }} className="d-block" />
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-bold my-8">Admin: Rubra Cards</h1>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit(verificaLogin)}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              {...register("email")}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A80633] focus:border-[#A80633] block w-full p-2.5"
              {...register("senha")}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-[#A80633] hover:bg-[#A80633]/90 focus:ring-4 focus:outline-none focus:ring-[#A80633]/30 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Entrar
          </button>
        </form>
      </div>
      <Toaster richColors position="top-right" />
    </main>
  )
}

