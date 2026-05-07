import { useAdminStore } from "../context/AdminContext"
import { IoExitOutline } from "react-icons/io5"
import { BiSolidDashboard } from "react-icons/bi"
import { BsCashCoin } from "react-icons/bs"
import { FaRegClone } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"

export function MenuLateral() {
  const navigate = useNavigate()
  const { deslogaAdmin } = useAdminStore()

  function adminSair() {
    if (confirm("Confirma saída do Admin?")) {
      deslogaAdmin()
      navigate("/", { replace: true })
    }
  }

  return (
    <aside
      id="admin-sidebar"
      className="fixed mt-20 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100 border-r border-gray-200">
        <ul className="space-y-2 font-medium">
          <li>
            <Link to="/admin" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <BiSolidDashboard />
              </span>
              <span className="ms-2 mt-1">Visão Geral</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/cartas" className="flex items-center p-2">
              <span className="h-5 text-gray-600 text-2xl">
                <FaRegClone />
              </span>
              <span className="ms-2 mt-1">Cadastro de Cartas</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/propostas" className="flex items-center p-2 cursor-pointer">
              <span className="h-5 text-gray-600 text-2xl">
                <BsCashCoin />
              </span>
              <span className="ms-2 mt-1">Controle de Propostas</span>
            </Link>
          </li>

          <li>
            <span className="flex items-center p-2 cursor-pointer">
              <span className="h-5 text-gray-600 text-2xl">
                <IoExitOutline />
              </span>
              <span className="ms-2 mt-1" onClick={adminSair}>
                Sair do Sistema
              </span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}

