import { FiUsers } from "react-icons/fi"
import { Link } from "react-router-dom"
import { useAdminStore } from "../context/AdminContext"

export function Titulo() {
  const { admin } = useAdminStore()

  return (
    <nav className="bg-white border-gray-200 flex flex-wrap justify-between fixed top-0 left-0 w-full z-50 border-b-2 border-gray-200">
      <div className="flex flex-wrap justify-between max-w-screen-xl p-4">
        <Link to="/admin" className="flex items-center space-x-3">
          <img src="../rubra-logo.png" className="w-9 transition-transform duration-300 group-hover:scale-110" alt="Logo Rubra" />
          <p className="text-2xl font-black tracking-tight text-[#A80633]">
            RUBRA ADMIN
          </p>
        </Link>
      </div>
      <div className="flex me-4 items-center font-bold text-[#A80633]">
        <FiUsers className="mr-2" />
        {admin?.nome}
      </div>
    </nav>
  )
}

