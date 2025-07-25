import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default ProtectedRoute
