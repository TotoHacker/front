import { useState } from 'react'
import axios from '../api/axios'
import Header from '../components/Header'

export default function LandingPage() {
  const [formData, setFormData] = useState({ nombre: '', correo: '', mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await axios.post('/leads', formData)
      setStatus('success')
      setModalMessage('¡Mensaje enviado con éxito! Gracias por contactarnos 😊')
      setShowModal(true)
      setFormData({ nombre: '', correo: '', mensaje: '' })
    } catch {
      setStatus('error')
      setModalMessage('Error al enviar, intenta nuevamente por favor 😞')
      setShowModal(true)
    }
  }

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <p className="text-lg">{modalMessage}</p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  )

  return (
    <>
    <Header />
    
      {showModal && <Modal />}

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#F0E8F8] via-[#E9F0F7] to-[#F8F1E7] px-4">
        <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg max-w-lg w-full p-8">
          <h1 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Contáctanos</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
            <input
              type="email"
              name="correo"
              placeholder="Tu correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
            <textarea
              name="mensaje"
              placeholder="Escribe tu mensaje..."
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition resize-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-purple-300 hover:bg-purple-400 disabled:bg-purple-200 text-white font-medium py-3 rounded-lg transition"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </section>
      </main>
    </>
  )
}
