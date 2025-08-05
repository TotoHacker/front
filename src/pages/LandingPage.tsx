import { useState, useRef } from 'react'
import axios from '../api/axios'
import Header from '../components/Header'
import ReCAPTCHA from 'react-google-recaptcha'
import heroImg from '../../public/images/Sin título.jpeg'
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

export default function LandingPage() {
  const [formData, setFormData] = useState({ nombre: '', correo: '', mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      setModalMessage('Debes aceptar los términos y condiciones.')
      setShowModal(true)
      return
    }

    if (!captchaToken) {
      setModalMessage('Completa el reCAPTCHA por favor.')
      setShowModal(true)
      return
    }

    setStatus('sending')
    try {
      await axios.post('/leads', formData)
      setStatus('success')
      setModalMessage('¡Mensaje enviado con éxito! Gracias por contactarnos 😊')
      setShowModal(true)
      setFormData({ nombre: '', correo: '', mensaje: '' })
      setAcceptedTerms(false)
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
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

      {/* HERO SECTION */}
      <section id="hero" className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Crea tu <span className="text-purple-400">futuro digital</span> con nosotres
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Construimos soluciones que impulsan tu visión. Contáctanos y llevemos tu proyecto al siguiente nivel.
            </p>
            <div className="flex gap-4">
              <button className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-medium">
                Conoce más
              </button>
              <button className="border border-purple-500 hover:bg-purple-500 hover:text-white px-6 py-3 rounded-lg font-medium">
                Servicios
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src={heroImg}
              alt="hero"
              className="w-full max-w-lg"
            />          
            </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
          <p className="text-gray-600">
            Nos apasiona la innovación, el diseño centrado en el usuario y la tecnología funcional. Ya sea una startup o una empresa consolidada, tenemos la solución perfecta para ti.
          </p>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="bg-gray-100 py-20 px-6" id="contacto">
        <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">Contáctanos</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              type="email"
              name="correo"
              placeholder="Tu correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <textarea
              name="mensaje"
              placeholder="Escribe tu mensaje..."
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los <a href="/terminos" className="text-purple-500 underline">términos y condiciones</a>
              </label>
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
            />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-3 rounded-lg transition"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
