import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const [autenticado, setAutenticado] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAutenticado(!!token)
  }, [location]) // se actualiza cada que cambia de ruta

  const handleLogout = () => {
    localStorage.removeItem('token')
    setAutenticado(false)
    navigate('/login')
  }

  return (
    <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-lg font-bold tracking-wide hover:underline">
          CRM Leads 💎
        </Link>

        {autenticado && (
          <Link
            to="/dashboard"
            className="text-sm underline hover:text-purple-200 transition"
          >
            Dashboard
          </Link>
        )}
      </div>

      {autenticado ? (
        <button
          onClick={handleLogout}
          className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-purple-100 transition"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link
          to="/login"
          className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-purple-100 transition"
        >
          Iniciar sesión
        </Link>
      )}
    </header>
  )
}
