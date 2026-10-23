import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import EvaluationsPage from './pages/EvaluationsPage'
import EvaluatorPage from './pages/EvaluatorPage'
import ReportPage from './pages/ReportPage'
import CasesPage from './pages/CasesPage'
import CaseDetailPage from './pages/CaseDetailPage'
import MatrixPage from './pages/MatrixPage'
import FoundationPage from './pages/FoundationPage'
import SettingsPage from './pages/SettingsPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="evaluaciones" element={<EvaluationsPage />} />
        <Route path="evaluaciones/nueva" element={<EvaluatorPage />} />
        <Route path="evaluaciones/:id" element={<ReportPage />} />
        <Route path="evaluaciones/:id/editar" element={<EvaluatorPage />} />
        <Route path="casos" element={<CasesPage />} />
        <Route path="casos/:id" element={<CaseDetailPage />} />
        <Route path="matriz" element={<MatrixPage />} />
        <Route path="fundamento" element={<FoundationPage />} />
        <Route path="ajustes" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
