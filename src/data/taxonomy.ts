import type { GroupCategory, PrincipleId, RiskCategory, Severity, PrincipleStatus } from '../types'

export const GROUP_CATEGORIES: { value: GroupCategory; label: string; hint: string }[] = [
  { value: 'usuarios', label: 'Usuarios directos', hint: 'Quienes interactúan con el sistema.' },
  { value: 'datos', label: 'Personas cuyos datos se procesan', hint: 'Quienes aportan o son descritos por los datos.' },
  { value: 'vulnerables', label: 'Grupos potencialmente vulnerables', hint: 'Quienes pueden sufrir más un error o un abuso.' },
  { value: 'comunidades', label: 'Comunidades afectadas', hint: 'Colectivos con identidad, memoria o territorio propios.' },
  { value: 'administradores', label: 'Administradores y responsables', hint: 'Quienes operan, mantienen o responden por el sistema.' },
  { value: 'terceros', label: 'Terceros con consecuencias indirectas', hint: 'Quienes no usan el sistema pero reciben sus efectos.' },
]

export const GROUP_LABEL: Record<GroupCategory, string> = Object.fromEntries(
  GROUP_CATEGORIES.map((g) => [g.value, g.label]),
) as Record<GroupCategory, string>

export interface RiskCategoryDef {
  value: RiskCategory
  label: string
  hint: string
  principles: PrincipleId[]
}

export const RISK_CATEGORIES: RiskCategoryDef[] = [
  { value: 'privacidad', label: 'Privacidad y uso de datos', hint: 'Recolección excesiva, usos no previstos, filtraciones.', principles: ['privacidad', 'dignidad'] },
  { value: 'discriminacion', label: 'Discriminación y sesgos', hint: 'Resultados desiguales entre grupos o criterios sesgados.', principles: ['justicia', 'dignidad'] },
  { value: 'transparencia', label: 'Falta de transparencia', hint: 'Decisiones que no se pueden explicar ni impugnar.', principles: ['transparencia', 'responsabilidad'] },
  { value: 'manipulacion', label: 'Manipulación de decisiones', hint: 'Patrones de diseño que presionan o explotan vulnerabilidades.', principles: ['autonomia'] },
  { value: 'exclusion', label: 'Exclusión y accesibilidad', hint: 'Barreras de acceso para ciertas personas o contextos.', principles: ['inclusion', 'justicia'] },
  { value: 'conflictos', label: 'Conflictos de intereses', hint: 'Incentivos particulares que comprometen la imparcialidad.', principles: ['responsabilidad', 'justicia', 'confianza'] },
  { value: 'supervision', label: 'Falta de supervisión humana', hint: 'Nadie revisa ni puede intervenir a tiempo.', principles: ['supervision', 'responsabilidad'] },
  { value: 'dano', label: 'Daño a personas o comunidades', hint: 'Perjuicios físicos, emocionales, sociales o económicos.', principles: ['cuidado', 'dignidad', 'confianza'] },
  { value: 'automatizacion', label: 'Acciones automatizadas sin límites adecuados', hint: 'Permisos amplios, acciones irreversibles, sin freno.', principles: ['supervision', 'cuidado'] },
]

export const RISK_LABEL: Record<RiskCategory, string> = Object.fromEntries(
  RISK_CATEGORIES.map((r) => [r.value, r.label]),
) as Record<RiskCategory, string>

export const SEVERITIES: { value: Severity; label: string }[] = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
]

export const STATUS_LABEL: Record<PrincipleStatus, string> = {
  cumplido: 'Cumplido según la autoevaluación',
  atencion: 'Requiere atención',
  no_evaluado: 'No evaluado',
}

export const STATUS_SHORT: Record<PrincipleStatus, string> = {
  cumplido: 'Cumplido (autoevaluación)',
  atencion: 'Requiere atención',
  no_evaluado: 'No evaluado',
}
