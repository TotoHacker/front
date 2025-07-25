import { useEffect, useState, useMemo } from 'react'
import axios from '../api/axios'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Header from '../components/Header'

type Lead = {
  id: string
  nombre: string
  correo: string
  mensaje: string
  estado: 'nuevo' | 'contactado' | 'descartado'
  fecha_creado: string
}

const estados = ['todos', 'nuevo', 'contactado', 'descartado'] as const
const colors = {
  nuevo: '#a78bfa', // pastel purple
  contactado: '#60a5fa', // pastel blue
  descartado: '#f87171', // pastel red
}

interface AxiosErrorResponse {
  response: {
    status: number
  }
}

// interface AxiosErrorLike {
//   response?: AxiosResponse
// }

function isAxiosError403(error: unknown): error is AxiosErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    (error as any).response !== null &&
    'status' in (error as any).response &&
    (error as any).response.status === 403
  )
}
export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filterEstado, setFilterEstado] = useState<typeof estados[number]>('todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const pageSize = 5

  const fetchLeads = async () => {
    setLoading(true)
    setError(false)
    try {
      const { data } = await axios.get('/leads')
      if (Array.isArray(data)) {
        setLeads(data)
      } else {
        console.error('Error: data recibida no es un arreglo', data)
        setLeads([])
        setError(true)
      }
    } catch (error: unknown) {
      if (isAxiosError403(error)) {
        setShowModal(true)
      } else {
        setError(true)
        console.error('Error fetching leads:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstado = async (id: string, estado: Lead['estado']) => {
    try {
      await axios.patch(`/leads/${id}`, { estado })
      setLeads(leads.map(lead => (lead.id === id ? { ...lead, estado } : lead)))
    } catch (err) {
      console.error('Error al cambiar estado', err)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const estadoMatch = filterEstado === 'todos' || lead.estado === filterEstado
      const searchTerm = search.toLowerCase()
      const textMatch =
        lead.nombre.toLowerCase().includes(searchTerm) ||
        lead.correo.toLowerCase().includes(searchTerm)
      return estadoMatch && textMatch
    })
  }, [leads, filterEstado, search])

  const pageCount = Math.ceil(filteredLeads.length / pageSize)
  const paginatedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize)

  const pieData = useMemo(() => {
    const counts = {
      nuevo: 0,
      contactado: 0,
      descartado: 0,
    }
    leads.forEach(lead => {
      counts[lead.estado]++
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value,
    }))
  }, [leads])

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h3 className="text-xl font-semibold mb-4">Acceso denegado</h3>
        <p className="mb-6">Tu sesión expiró o no tienes permiso para acceder. Por favor, inicia sesión nuevamente.</p>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          onClick={() => {
            setShowModal(false)
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
        >
          Ir a Login
        </button>
      </div>
    </div>
  )

  return (
    <>
    <Header />
      {showModal && <Modal />}

      <main className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EAECEE] p-6">
        <section className="max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Panel de Leads</h2>

          {loading && <p className="text-center text-gray-500">Cargando leads...</p>}
          {error && <p className="text-center text-red-500">Error al cargar los leads.</p>}

          {!loading && !error && (
            <>
              {/* Filtros y búsqueda */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                  <label className="mr-2 font-semibold text-gray-700">Filtrar por estado:</label>
                  <select
                    value={filterEstado}
                    onChange={e => {
                      setFilterEstado(e.target.value as typeof estados[number])
                      setPage(1)
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1"
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 w-full md:w-72"
                />
              </div>

              {/* Resumen */}
              <div className="flex justify-around mb-8 text-gray-700 font-medium text-sm md:text-base">
                <div> Total leads: <span className="font-bold">{leads.length}</span> </div>
                <div> Nuevos: <span className="font-bold">{leads.filter(l => l.estado === 'nuevo').length}</span> </div>
                <div> Contactados: <span className="font-bold">{leads.filter(l => l.estado === 'contactado').length}</span> </div>
                <div> Descartados: <span className="font-bold">{leads.filter(l => l.estado === 'descartado').length}</span> </div>
              </div>

              {/* Gráfica de pastel */}
              <div style={{ width: '100%', height: 250, marginBottom: 30 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent = 0 }) =>
                        `${name.charAt(0).toUpperCase() + name.slice(1)} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[entry.name as keyof typeof colors]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-xl">
                  <thead className="bg-purple-100 text-purple-800 text-sm">
                    <tr>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Correo</th>
                      <th className="px-4 py-2 text-left">Mensaje</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className="even:bg-purple-50 hover:bg-purple-100 transition">
                        <td className="px-4 py-3">{lead.nombre}</td>
                        <td className="px-4 py-3">{lead.correo}</td>
                        <td className="px-4 py-3 max-w-xs">{lead.mensaje}</td>
                        <td className="px-4 py-3 capitalize">{lead.estado}</td>
                        <td className="px-4 py-3">
                          {new Date(lead.fecha_creado).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 space-x-1">
                          {['nuevo', 'contactado', 'descartado'].map((estado) => (
                            <button
                              key={estado}
                              onClick={() => actualizarEstado(lead.id, estado as Lead['estado'])}
                              className={`px-3 py-1 rounded-lg text-xs transition ${
                                lead.estado === estado
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-200 hover:bg-purple-200'
                              }`}
                            >
                              {estado}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="flex justify-center gap-2 mt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-purple-100 disabled:opacity-50"
                >
                  Anterior
                </button>
                {[...Array(pageCount)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded border border-gray-300 hover:bg-purple-100 ${
                      page === i + 1 ? 'bg-purple-500 text-white' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= pageCount}
                  onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-purple-100 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  )
}
