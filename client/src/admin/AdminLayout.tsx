import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Toaster } from "sonner"
import { useAdminStore } from "./context/AdminContext"

import { Titulo } from "./components/Titulo"
import { MenuLateral } from "./components/MenuLateral"

export default function AdminLayout() {
  const { admin } = useAdminStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!admin?.id) {
      navigate("/admin/login", { replace: true })
    }
  }, [admin?.id, navigate])

  if (!admin?.id) return null

  return (
    <>
      <Titulo />
      <MenuLateral />
      <div className="p-4 sm:ml-64 bg-slate-50/50 min-h-screen">
        <Outlet />
      </div>
      <Toaster richColors position="top-right" />
    </>
  )
}

