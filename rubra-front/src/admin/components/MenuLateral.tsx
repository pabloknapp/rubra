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
    deslogaAdmin()
    navigate("/admin/login", { replace: true })
  }

  return (
    <aside
      id="admin-sidebar"
      className="fixed mt-5 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-4 py-6 overflow-y-auto bg-white border-r border-slate-200 shadow-sm">
        <div className="mb-6 px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Principal</p>
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            <Link to="/admin" className="flex items-center p-3 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-[#A80633] transition-colors group">
              <span className="text-2xl text-slate-400 group-hover:text-[#A80633] transition-colors">
                <BiSolidDashboard />
              </span>
              <span className="ms-3 font-semibold">Visão Geral</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/cartas" className="flex items-center p-3 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-[#A80633] transition-colors group">
              <span className="text-2xl text-slate-400 group-hover:text-[#A80633] transition-colors">
                <FaRegClone />
              </span>
              <span className="ms-3 font-semibold">Cadastro de Cartas</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/propostas" className="flex items-center p-3 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-[#A80633] transition-colors group">
              <span className="text-2xl text-slate-400 group-hover:text-[#A80633] transition-colors">
                <BsCashCoin />
              </span>
              <span className="ms-3 font-semibold">Controle Propostas</span>
            </Link>
          </li>
        </ul>

        <div className="mt-8 px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Conta</p>
          <ul>
            <li>
              <button onClick={adminSair} className="w-full flex items-center p-3 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-[#A80633] hover:cursor-pointer transition-colors group">
                <span className="text-2xl">
                  <IoExitOutline />
                </span>
                <span className="ms-3 font-bold">Sair</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}

