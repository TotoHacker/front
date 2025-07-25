import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import Header from '../components/Header'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch {
  setError('Correo o contraseña inválidos')
}

  }

  return (
    <>
    <Header />
    <main className="min-h-screen bg-gradient-to-br from-[#F7F0FA] via-[#EEF3F8] to-[#FDF9F5] flex items-center justify-center px-4">
          
      
      <section className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Acceso Administrador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          />
          <button
            type="submit"
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-medium py-3 rounded-lg transition"
          >
            Iniciar sesión
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>
      </section>
    </main>
    </>
  )
}
