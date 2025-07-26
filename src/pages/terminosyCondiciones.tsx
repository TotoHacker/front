import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function Terminos() {
  return (
    <>
    <Header/>
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md my-12">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Términos y Condiciones</h1>

      <p className="mb-4 text-gray-700">
        Al utilizar este sitio web, aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos cuidadosamente.
      </p>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Uso del sitio</h2>
        <p className="text-gray-600">
          El contenido proporcionado en este sitio es solo para fines informativos y no garantiza resultados específicos.
          Está prohibido utilizar el sitio para actividades ilegales o no autorizadas.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Privacidad</h2>
        <p className="text-gray-600">
          Respetamos tu privacidad y manejamos tus datos conforme a nuestra política de privacidad. No compartimos tu información con terceros sin tu consentimiento.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Limitación de responsabilidad</h2>
        <p className="text-gray-600">
          No nos hacemos responsables por daños directos o indirectos derivados del uso del sitio o de la información proporcionada.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cambios en los términos</h2>
        <p className="text-gray-600">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al publicarse en esta página.
        </p>
      </section>

      <p className="text-sm text-gray-500">
        Volver al <Link to="/" className="text-purple-600 underline hover:text-purple-800">inicio</Link>.
      </p>
    </div>
    </>
  )
}
