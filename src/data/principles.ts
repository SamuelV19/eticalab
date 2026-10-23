import type { PrincipleId } from '../types'

export interface PrincipleDef {
  id: PrincipleId
  name: string
  short: string
  description: string
  questions: string[]
  recommendations: string[]
}

export const PRINCIPLES: PrincipleDef[] = [
  {
    id: 'dignidad',
    name: 'Dignidad humana',
    short: 'Dignidad',
    description: 'Las personas son sujetos de derechos, no solo fuentes de datos ni medios para un fin técnico.',
    questions: [
      '¿El sistema trata a las personas como sujetos con derechos y no únicamente como registros o métricas?',
      '¿Hay decisiones que podrían humillar, estigmatizar o reducir a las personas a una etiqueta?',
      '¿Las personas pueden corregir o cuestionar cómo las representa el sistema?',
    ],
    recommendations: [
      'Revisa el lenguaje, las categorías y las etiquetas que el sistema asigna a las personas.',
      'Ofrece un canal para que las personas corrijan o impugnen la información que las describe.',
    ],
  },
  {
    id: 'privacidad',
    name: 'Privacidad y protección de datos',
    short: 'Privacidad',
    description: 'Se recoge y utiliza solo la información necesaria para una finalidad legítima y declarada.',
    questions: [
      '¿Cada dato recopilado es necesario para la finalidad declarada?',
      '¿Las personas saben qué se recoge, para qué, por cuánto tiempo y quién accede?',
      '¿Existen medidas de seguridad, retención limitada y posibilidad de eliminar los datos?',
    ],
    recommendations: [
      'Elimina o aplaza la recolección de los datos que no sean imprescindibles.',
      'Define plazos de retención, controles de acceso y un procedimiento de borrado.',
    ],
  },
  {
    id: 'justicia',
    name: 'Justicia y no discriminación',
    short: 'Justicia',
    description: 'El sistema no perjudica injustamente a ningún grupo ni reproduce sesgos presentes en los datos o en los criterios.',
    questions: [
      '¿Se han revisado los datos y los criterios en busca de sesgos que afecten a ciertos grupos?',
      '¿Se midió el desempeño del sistema por separado en los distintos grupos afectados?',
      '¿Existe una vía para detectar y corregir resultados desiguales después del lanzamiento?',
    ],
    recommendations: [
      'Compara los resultados entre grupos antes del lanzamiento y de forma periódica después.',
      'Documenta los criterios de decisión y retira variables que funcionen como sustitutos de rasgos protegidos.',
    ],
  },
  {
    id: 'transparencia',
    name: 'Transparencia y explicabilidad',
    short: 'Transparencia',
    description: 'Las personas pueden comprender los criterios, límites y consecuencias relevantes de las decisiones del sistema.',
    questions: [
      '¿Una persona afectada puede saber que interviene un sistema automatizado?',
      '¿Se puede explicar en lenguaje comprensible por qué se tomó una decisión?',
      '¿Se registran las decisiones y sus motivos para poder auditarlas?',
    ],
    recommendations: [
      'Entrega a cada persona afectada el motivo principal de la decisión y los pasos para impugnarla.',
      'Conserva un registro de decisiones con la versión del modelo o de las reglas utilizadas.',
    ],
  },
  {
    id: 'autonomia',
    name: 'Autonomía humana',
    short: 'Autonomía',
    description: 'Las personas conservan la capacidad de decidir libremente y no son manipuladas por el diseño.',
    questions: [
      '¿El diseño evita patrones que presionan, confunden o explotan sesgos y vulnerabilidades?',
      '¿Las personas pueden rechazar, pausar o abandonar el sistema sin penalización?',
      '¿Las opciones por defecto favorecen los intereses de la persona y no solo los del producto?',
    ],
    recommendations: [
      'Sustituye los patrones de presión (urgencia falsa, opciones preseleccionadas) por decisiones informadas.',
      'Haz que rechazar o salir sea tan fácil como aceptar o entrar.',
    ],
  },
  {
    id: 'responsabilidad',
    name: 'Responsabilidad y rendición de cuentas',
    short: 'Responsabilidad',
    description: 'Hay personas identificables que responden por las decisiones, los riesgos asumidos y las correcciones.',
    questions: [
      '¿Hay una persona o equipo nombrado como responsable de las consecuencias del sistema?',
      '¿Están documentadas las decisiones, los riesgos aceptados y las alternativas descartadas?',
      '¿Existe un mecanismo para corregir daños y revisar la decisión con el tiempo?',
    ],
    recommendations: [
      'Asigna un responsable con nombre y una fecha de revisión para cada riesgo aceptado.',
      'Guarda la justificación de la decisión junto con las alternativas que se descartaron.',
    ],
  },
  {
    id: 'cuidado',
    name: 'Cuidado y prevención del daño',
    short: 'Cuidado',
    description: 'Se anticipan las consecuencias negativas, incluidas las indirectas, y se establecen medidas para reducirlas.',
    questions: [
      '¿Se analizaron los daños posibles para usuarios, terceros y comunidades?',
      '¿Hay medidas concretas para prevenir, detectar y revertir esos daños?',
      '¿Se consideraron los efectos sobre las relaciones y el bienestar de las personas?',
    ],
    recommendations: [
      'Define señales de alerta y un procedimiento de respuesta ante incidentes.',
      'Prueba el sistema con personas en situación de vulnerabilidad antes de ampliarlo.',
    ],
  },
  {
    id: 'inclusion',
    name: 'Inclusión y accesibilidad',
    short: 'Inclusión',
    description: 'El sistema es utilizable por personas con distintas capacidades, idiomas, recursos y contextos.',
    questions: [
      '¿Se consideraron personas con discapacidad, baja conectividad o poca alfabetización digital?',
      '¿La interfaz cumple criterios de accesibilidad (teclado, contraste, lectores de pantalla)?',
      '¿Hay alternativas para quienes no pueden o no quieren usar el canal digital principal?',
    ],
    recommendations: [
      'Audita la accesibilidad con las pautas WCAG y pruébala con usuarios reales.',
      'Ofrece un canal alternativo para quienes queden fuera del flujo digital.',
    ],
  },
  {
    id: 'confianza',
    name: 'Confianza y participación',
    short: 'Confianza',
    description: 'Las personas y comunidades afectadas pueden opinar y participar en las decisiones que las involucran.',
    questions: [
      '¿Se consultó a las personas o comunidades afectadas durante el diseño?',
      '¿Existe un canal para que expresen dudas, quejas o propuestas y reciban respuesta?',
      '¿Se comunican con claridad los límites y las limitaciones del sistema?',
    ],
    recommendations: [
      'Incorpora a representantes de los grupos afectados en la revisión del diseño.',
      'Publica las limitaciones conocidas y un canal de contacto con tiempos de respuesta.',
    ],
  },
  {
    id: 'supervision',
    name: 'Supervisión humana de sistemas automatizados',
    short: 'Supervisión',
    description: 'Los controles humanos son proporcionales al impacto de las acciones y decisiones automatizadas.',
    questions: [
      '¿Una persona revisa las decisiones o acciones de alto impacto antes de que surtan efecto?',
      '¿Los permisos del sistema están limitados a lo estrictamente necesario?',
      '¿Se puede detener el sistema, deshacer sus acciones e intervenir en cualquier momento?',
    ],
    recommendations: [
      'Exige aprobación humana para las acciones irreversibles o de alto impacto.',
      'Aplica permisos mínimos, límites operativos y un interruptor de parada documentado.',
    ],
  },
]

export const PRINCIPLE_BY_ID: Record<PrincipleId, PrincipleDef> = Object.fromEntries(
  PRINCIPLES.map((p) => [p.id, p]),
) as Record<PrincipleId, PrincipleDef>

export const PRINCIPLE_IDS: PrincipleId[] = PRINCIPLES.map((p) => p.id)
