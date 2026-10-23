import type { PrincipleId } from '../types'

export interface TraceRow {
  theme: string
  problem: string
  designPrinciple: string
  principles: PrincipleId[]
  feature: string
  benefit: string
}

export const TRACEABILITY: TraceRow[] = [
  {
    theme: 'Ética, diversidad y convivencia en América Latina',
    problem: 'Tecnologías pensadas para un usuario «promedio» excluyen o perjudican a grupos distintos.',
    designPrinciple: 'Inclusión y accesibilidad como requisito, no como añadido.',
    principles: ['inclusion', 'justicia'],
    feature: 'Etapa de personas afectadas con grupos vulnerables y categoría de riesgo «Exclusión y accesibilidad»; interfaz de ÉticaLab con teclado, foco visible y contraste.',
    benefit: 'El equipo identifica a quién deja fuera antes de construir.',
  },
  {
    theme: 'El sentido de lo humano y la biología del convivir',
    problem: 'Se mide el éxito solo por eficiencia y se ignora el efecto sobre el bienestar y las relaciones.',
    designPrinciple: 'Bienestar y prevención del daño por encima de la eficiencia.',
    principles: ['cuidado', 'dignidad'],
    feature: 'Categoría de riesgo «Daño a personas o comunidades», principio de cuidado y campo de medidas preventivas por riesgo.',
    benefit: 'Cada riesgo termina con una medida concreta y no solo con una advertencia.',
  },
  {
    theme: 'Ética y confianza ciudadana en las instituciones públicas',
    problem: 'Decisiones automatizadas que nadie puede explicar ni impugnar erosionan la confianza.',
    designPrinciple: 'Transparencia y rendición de cuentas.',
    principles: ['transparencia', 'responsabilidad', 'confianza'],
    feature: 'Preguntas guía de explicabilidad, decisión final con justificación y responsable de revisión, informe imprimible.',
    benefit: 'La decisión queda razonada y atribuida a personas concretas.',
  },
  {
    theme: 'Ciencia en red y construcción colaborativa del conocimiento',
    problem: 'Sin documentación no se puede revisar cómo se llegó a un resultado ni compartirlo con integridad.',
    designPrinciple: 'Documentación y trazabilidad.',
    principles: ['responsabilidad', 'transparencia'],
    feature: 'Historial de evaluaciones con fechas, exportación e importación de copias JSON y alternativas descartadas registradas.',
    benefit: 'Otro equipo puede revisar, reutilizar y auditar lo decidido.',
  },
  {
    theme: 'Neuroética y ciudadanía en el siglo XXI',
    problem: 'Patrones de diseño que explotan sesgos cognitivos limitan la libertad de decidir.',
    designPrinciple: 'Autonomía y prevención de la manipulación.',
    principles: ['autonomia'],
    feature: 'Categoría «Manipulación de decisiones», principio de autonomía con preguntas sobre opciones por defecto y salida sin penalización.',
    benefit: 'El equipo detecta patrones manipulativos antes de que lleguen a producción.',
  },
  {
    theme: 'Turismo cultural, memoria e innovación social en la Comuna 13',
    problem: 'Historias, imágenes y datos de una comunidad se usan sin su participación ni consideración.',
    designPrinciple: 'Dignidad, privacidad y respeto por las comunidades.',
    principles: ['dignidad', 'privacidad', 'confianza'],
    feature: 'Categoría de personas «Comunidades afectadas», principios de dignidad, privacidad y participación, y un caso práctico sobre contenido comunitario.',
    benefit: 'La participación de la comunidad pasa a ser una pregunta obligatoria del análisis.',
  },
  {
    theme: 'Conflictos de intereses en la gestión pública',
    problem: 'Incentivos particulares sesgan los criterios de un sistema de decisión sin que se note.',
    designPrinciple: 'Imparcialidad, identificación de sesgos y justificación de decisiones.',
    principles: ['justicia', 'responsabilidad'],
    feature: 'Categoría «Conflictos de intereses», comparación de alternativas con riesgos y limitaciones, y un caso práctico de selección de candidatos.',
    benefit: 'Los intereses en juego y las limitaciones quedan visibles en el informe.',
  },
  {
    theme: 'Decisiones éticas en tiempos de inteligencia artificial y agentes inteligentes',
    problem: 'Agentes con permisos amplios actúan sin límites claros ni posibilidad de intervención.',
    designPrinciple: 'Supervisión humana, límites operativos y responsabilidad.',
    principles: ['supervision', 'cuidado', 'responsabilidad'],
    feature: 'Categorías «Falta de supervisión humana» y «Acciones automatizadas sin límites», principio de supervisión y un caso práctico de agente autónomo.',
    benefit: 'Se definen permisos mínimos, aprobaciones y frenos antes de dar autonomía al sistema.',
  },
]
