import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { ToastProvider } from '../components/Toast'
import { _invalidateCache, getEvaluations } from '../utils/storage'

function mount(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  cleanup()
  localStorage.clear()
  _invalidateCache()
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
})

describe('flujo completo de la aplicación', () => {
  it('muestra un estado vacío con indicadores en cero cuando no hay datos', () => {
    mount('/')
    expect(screen.getByText('Todavía no tienes evaluaciones')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3)
    expect(screen.getAllByRole('link', { name: /Nueva evaluación ética/ }).length).toBeGreaterThan(0)
  })

  it('valida la primera etapa antes de avanzar', async () => {
    const user = userEvent.setup()
    mount('/evaluaciones/nueva')
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(await screen.findByText('Escribe el nombre del proyecto.')).toBeInTheDocument()
    expect(screen.getByText('Describe brevemente la solución.')).toBeInTheDocument()
    expect(getEvaluations()).toHaveLength(0)
  })

  it('crea una evaluación, la guarda, genera el informe, la edita y la elimina', async () => {
    const user = userEvent.setup()
    mount('/evaluaciones/nueva')

    await user.type(screen.getByLabelText(/Nombre del proyecto/), 'Asistente de admisiones')
    await user.type(screen.getByLabelText(/Descripción de la solución/), 'Clasifica solicitudes')
    await user.type(screen.getByLabelText(/Objetivo principal/), 'Agilizar admisiones')
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    // Personas afectadas
    await user.click(screen.getByRole('button', { name: /Grupos potencialmente vulnerables/ }))
    await user.type(screen.getByLabelText('Nombre del grupo'), 'Aspirantes rurales')
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    // Riesgos
    await user.click(screen.getByRole('button', { name: /Discriminación y sesgos/ }))
    await user.type(screen.getByLabelText('Descripción del riesgo'), 'Penaliza colegios rurales')
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    // Principios
    const attention = screen.getAllByRole('radio', { name: /Requiere atención/ })
    await user.click(attention[2]) // justicia
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    // Alternativas
    const names = screen.getAllByLabelText('Nombre de la alternativa')
    await user.type(names[0], 'Modelo con auditoría')
    await user.type(names[1], 'Revisión humana total')
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    // Decisión: validar y completar
    await user.click(screen.getByRole('button', { name: /Finalizar y ver informe/ }))
    expect(await screen.findByText('Elige la alternativa que adoptarás.')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText(/Alternativa elegida/), 'Revisión humana total')
    await user.type(screen.getByLabelText(/Justificación/), 'Reduce el riesgo de sesgo')
    await user.type(screen.getByLabelText('Responsable de revisar las medidas'), 'Ana Pérez')
    await user.click(screen.getByRole('button', { name: /Finalizar y ver informe/ }))

    // Informe con datos reales
    expect(await screen.findByRole('heading', { level: 1, name: 'Asistente de admisiones' })).toBeInTheDocument()
    expect(screen.getByText('Penaliza colegios rurales')).toBeInTheDocument()
    expect(screen.getByText('Aspirantes rurales')).toBeInTheDocument()
    expect(screen.getByText('Reduce el riesgo de sesgo')).toBeInTheDocument()
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.getAllByText('Este principio aún no se ha evaluado.').length).toBe(9)
    expect(screen.getByText(/«Justicia y no discriminación» requiere atención y todavía no tiene medida de mejora/)).toBeInTheDocument()

    // Persistencia tras «recargar»
    const saved = getEvaluations()
    expect(saved).toHaveLength(1)
    expect(saved[0].status).toBe('completada')
    _invalidateCache()
    cleanup()
    mount(`/evaluaciones/${saved[0].id}`)
    expect(await screen.findByRole('heading', { level: 1, name: 'Asistente de admisiones' })).toBeInTheDocument()

    // Dashboard refleja los cambios
    cleanup()
    mount('/')
    expect(screen.getByText('Evaluaciones recientes')).toBeInTheDocument()
    const stats = screen.getByRole('region', { name: 'Indicadores' })
    expect(within(stats).getByText('Evaluaciones creadas').previousSibling).toHaveTextContent('1')
    expect(within(stats).getByText('Riesgos identificados').previousSibling).toHaveTextContent('1')
    expect(within(stats).getByText('Decisiones documentadas').previousSibling).toHaveTextContent('1')

    // Editar
    cleanup()
    mount(`/evaluaciones/${saved[0].id}/editar`)
    const nameInput = screen.getByLabelText(/Nombre del proyecto/)
    expect(nameInput).toHaveValue('Asistente de admisiones')
    await user.clear(nameInput)
    await user.type(nameInput, 'Admisiones v2')
    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))
    expect(getEvaluations()[0].project.name).toBe('Admisiones v2')

    // Buscar, filtrar y eliminar con confirmación
    cleanup()
    mount('/evaluaciones')
    await user.type(screen.getByLabelText('Buscar por nombre'), 'zzz')
    expect(screen.getByText('Ninguna evaluación coincide')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Buscar por nombre'))
    await user.type(screen.getByLabelText('Buscar por nombre'), 'admisiones')
    expect(screen.getByText('Admisiones v2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Eliminar Admisiones v2' }))
    expect(getEvaluations()).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Eliminar evaluación' }))
    expect(getEvaluations()).toHaveLength(0)
    expect(await screen.findByText('No hay evaluaciones guardadas')).toBeInTheDocument()
  })

  it('abre un caso y lo usa como punto de partida editable', async () => {
    const user = userEvent.setup()
    mount('/casos')
    expect(screen.getAllByRole('link', { name: /Abrir caso/ })).toHaveLength(6)
    await user.click(screen.getAllByRole('link', { name: /Abrir caso/ })[4])
    expect(screen.getByText(/Caso educativo creado para ÉticaLab/)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /Usar como punto de partida/ })[0])
    expect(await screen.findByDisplayValue(/Caso: Un agente de IA/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))
    const saved = getEvaluations()
    expect(saved).toHaveLength(1)
    expect(saved[0].sourceCaseId).toBe('agente-sin-supervision')
    expect(saved[0].risks.length).toBeGreaterThan(0)
  })

  it('la matriz permite cambiar la valoración y la guarda', async () => {
    const user = userEvent.setup()
    mount('/casos/datos-innecesarios')
    await user.click(screen.getAllByRole('button', { name: /Usar como punto de partida/ })[0])
    await screen.findByDisplayValue(/Caso: Una app de recetas/)
    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))
    cleanup()
    mount('/matriz')
    expect(screen.getByText(/0 de 10 principios valorados/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Editar valoración de Privacidad y protección de datos' }))
    await user.click(screen.getByRole('radio', { name: /Requiere atención/ }))
    expect(getEvaluations()[0].principles.privacidad.status).toBe('atencion')
    await user.click(screen.getByRole('button', { name: 'Cerrar edición' }))
    await user.click(screen.getByRole('button', { name: 'Requieren atención' }))
    expect(screen.getByText('Privacidad y protección de datos')).toBeInTheDocument()
    expect(screen.queryByText('Dignidad humana')).not.toBeInTheDocument()
  })

  it('importa una copia válida y rechaza una malformada sin romperse', async () => {
    const user = userEvent.setup()
    mount('/ajustes')
    const input = screen.getByTestId('import-input')
    await user.upload(input, new File(['no es json {{'], 'malo.json', { type: 'application/json' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('no es un JSON válido')

    const backup = {
      app: 'eticalab',
      version: 1,
      evaluations: [{ project: { name: 'Importada', type: 'ia', description: 'd', objective: 'o', context: '' } }, 'basura'],
    }
    await user.upload(input, new File([JSON.stringify(backup)], 'ok.json', { type: 'application/json' }))
    expect(await screen.findByText(/El archivo es válido: 1 evaluación/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Combinar con mis datos' }))
    expect(getEvaluations().map((e) => e.project.name)).toEqual(['Importada'])
  })

  it('restablece los datos solo tras confirmar', async () => {
    const user = userEvent.setup()
    mount('/casos/ia-discriminatoria')
    await user.click(screen.getAllByRole('button', { name: /Usar como punto de partida/ })[0])
    await screen.findByDisplayValue(/Caso: Un modelo de crédito/)
    await user.click(screen.getByRole('button', { name: 'Guardar borrador' }))
    cleanup()
    mount('/ajustes')
    await user.click(screen.getByRole('button', { name: 'Restablecer datos' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(getEvaluations()).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Restablecer datos' }))
    await user.click(screen.getByRole('button', { name: 'Borrar todo' }))
    expect(getEvaluations()).toHaveLength(0)
  })

  it('la sección de fundamento muestra la matriz de trazabilidad y rutas desconocidas no rompen', () => {
    mount('/fundamento')
    expect(screen.getAllByText('Neuroética y ciudadanía en el siglo XXI').length).toBeGreaterThan(0)
    cleanup()
    mount('/ruta-que-no-existe')
    expect(screen.getByText('Esta página no existe')).toBeInTheDocument()
  })
})
