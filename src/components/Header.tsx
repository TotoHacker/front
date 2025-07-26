import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const [autenticado, setAutenticado] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAutenticado(!!token)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setAutenticado(false)
    navigate('/login')
  }

  // Función para navegar dentro de la landing hacia secciones con smooth scroll
  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false })
      // Esperamos que la ruta cambie antes de hacer scroll
      setTimeout(() => {
        const el = document.getElementById(id)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="flex gap-8 items-center font-semibold tracking-wide">
        <Link to="/" className="text-xl font-extrabold hover:text-purple-300 transition">
          CRM Leads 💎
        </Link>

        <button
          onClick={() => scrollToSection('hero')}
          className="hover:text-purple-300 transition text-sm"
          aria-label="Ir a inicio"
        >
          Inicio
        </button>

        <button
          onClick={() => scrollToSection('sobre-nosotros')}
          className="hover:text-purple-300 transition text-sm"
          aria-label="Ir a sobre nosotros"
        >
          Sobre Nosotros
        </button>

        <button
          onClick={() => scrollToSection('contacto')}
          className="hover:text-purple-300 transition text-sm"
          aria-label="Ir a contacto"
        >
          Contacto
        </button>

        {autenticado && (
          <Link
            to="/dashboard"
            className="text-sm underline hover:text-purple-200 transition"
          >
            Dashboard
          </Link>
        )}
      </div>

      <div>
        {autenticado ? (
          <button
            onClick={handleLogout}
            className="bg-white text-purple-700 px-5 py-2 rounded-full font-semibold hover:bg-purple-100 transition shadow-md"
          >
            Cerrar sesión
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-purple-700 px-5 py-2 rounded-full font-semibold hover:bg-purple-100 transition shadow-md"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  )
}
