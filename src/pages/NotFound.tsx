import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <EmptyState title="Esta página no existe" text="La dirección que abriste no corresponde a ninguna sección de ÉticaLab.">
      <Link to="/" className="btn btn-primary">
        Volver al panel
      </Link>
    </EmptyState>
  )
}
