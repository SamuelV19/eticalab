import type { AffectedGroup, Alternative, Evaluation, PrincipleId, Risk, SystemType } from '../types'
import { newAlternative, newEvaluation, newGroup, newRisk } from '../utils/factory'

export interface CaseStudy {
  id: string
  title: string
  tagline: string
  systemType: SystemType
  context: string
  objective: string
  problem: string
  groups: Pick<AffectedGroup, 'category' | 'name' | 'description'>[]
  principles: PrincipleId[]
  risks: Omit<Risk, 'id'>[]
  alternatives: Omit<Alternative, 'id'>[]
  measures: string[]
  questions: string[]
}

export const CASES: CaseStudy[] = [
  {
    id: 'ia-discriminatoria',
    title: 'Un modelo de crédito que penaliza barrios enteros',
    tagline: 'Una IA que produce resultados discriminatorios',
    systemType: 'ia',
    context:
      'Una fintech entrena un modelo para aprobar microcréditos con historiales de pago de los últimos diez años. El modelo reduce la mora, pero las solicitudes de ciertos barrios y de mujeres cabeza de hogar se rechazan con mucha más frecuencia que las demás.',
    objective: 'Reducir la mora y acelerar la aprobación de microcréditos.',
    problem:
      'El historial refleja desigualdades pasadas y el código postal funciona como sustituto de rasgos protegidos. El modelo es preciso en promedio, pero reproduce y amplifica la exclusión.',
    groups: [
      { category: 'usuarios', name: 'Solicitantes de crédito', description: 'Personas que piden un microcrédito en la aplicación.' },
      { category: 'vulnerables', name: 'Mujeres cabeza de hogar y habitantes de barrios periféricos', description: 'Reciben más rechazos con perfiles financieros similares.' },
      { category: 'administradores', name: 'Equipo de riesgo y ciencia de datos', description: 'Mantiene el modelo y responde por sus resultados.' },
    ],
    principles: ['justicia', 'dignidad', 'transparencia', 'responsabilidad'],
    risks: [
      { category: 'discriminacion', description: 'El modelo rechaza con más frecuencia a ciertos barrios y géneros con riesgo financiero comparable.', affected: 'Mujeres cabeza de hogar y barrios periféricos', consequences: 'Exclusión financiera persistente y pérdida de oportunidades.', preventive: 'Comparar tasas de aprobación por grupo antes y después del lanzamiento; retirar variables sustitutas.', severity: 'alta' },
      { category: 'transparencia', description: 'El solicitante recibe solo «solicitud no aprobada», sin motivo ni vía de apelación.', affected: 'Solicitantes rechazados', consequences: 'No pueden corregir datos erróneos ni impugnar la decisión.', preventive: 'Entregar motivos principales y un canal de revisión humana.', severity: 'media' },
    ],
    alternatives: [
      { name: 'Modelo actual con auditoría de sesgo', description: 'Mantener el modelo y añadir métricas de equidad por grupo y monitoreo mensual.', benefits: 'Cambio rápido y bajo costo.', risks: 'El sesgo estructural de los datos puede persistir.', affected: 'Solicitantes de barrios periféricos', principles: ['justicia', 'transparencia'], limitations: 'Depende de que existan datos para medir los grupos.', mitigation: 'Umbral máximo de disparidad que active una revisión del modelo.' },
      { name: 'Modelo reentrenado y revisión humana de rechazos', description: 'Retirar variables sustitutas, rebalancear datos y enviar los rechazos de borde a un analista.', benefits: 'Reduce la disparidad y permite explicar la decisión.', risks: 'Mayor costo operativo y menor velocidad.', affected: 'Equipo de riesgo y solicitantes', principles: ['justicia', 'dignidad', 'supervision'], limitations: 'Puede subir ligeramente la mora en el corto plazo.', mitigation: 'Piloto controlado y revisión trimestral de resultados.' },
    ],
    measures: ['Medir el desempeño por grupo y publicar los resultados internamente.', 'Retirar o transformar variables que sustituyan rasgos protegidos.', 'Dar motivos comprensibles y un proceso de apelación con revisión humana.'],
    questions: ['¿Qué significa «preciso» si el error se concentra en los mismos grupos?', '¿Quién responde si el modelo reproduce una desigualdad histórica?', '¿Cuánta disparidad es aceptable y quién lo decide?'],
  },
  {
    id: 'datos-innecesarios',
    title: 'Una app de recetas que pide el documento y la ubicación',
    tagline: 'Una aplicación que solicita datos personales innecesarios',
    systemType: 'movil',
    context:
      'Una aplicación gratuita de recetas exige número de documento, ubicación permanente, contactos y fecha de nacimiento para crear la cuenta. Parte de esos datos se comparte con socios publicitarios.',
    objective: 'Ofrecer recetas personalizadas y financiar el servicio con publicidad.',
    problem:
      'La cantidad de datos recopilados no guarda relación con la finalidad declarada. Las personas aceptan porque no pueden usar la app si rechazan, y no saben con quién se comparten sus datos.',
    groups: [
      { category: 'usuarios', name: 'Personas usuarias de la app', description: 'Crean una cuenta para consultar recetas.' },
      { category: 'datos', name: 'Contactos de los usuarios', description: 'Sus datos se recogen sin que lo sepan ni lo hayan consentido.' },
      { category: 'vulnerables', name: 'Menores de edad que usan la app', description: 'Pueden registrarse sin supervisión.' },
    ],
    principles: ['privacidad', 'autonomia', 'dignidad', 'transparencia'],
    risks: [
      { category: 'privacidad', description: 'Se recopilan datos que no son necesarios y se comparten con terceros publicitarios.', affected: 'Usuarios y sus contactos', consequences: 'Perfilamiento, filtraciones y usos no previstos.', preventive: 'Eliminar los campos innecesarios y definir un plazo de retención.', severity: 'alta' },
      { category: 'manipulacion', description: 'El consentimiento es una casilla preseleccionada sin alternativa real.', affected: 'Usuarios', consequences: 'Consentimientos que no son informados ni libres.', preventive: 'Consentimiento granular, apagado por defecto y funcionamiento básico sin él.', severity: 'media' },
    ],
    alternatives: [
      { name: 'Recolección mínima', description: 'Cuenta con correo y preferencias de cocina; ubicación solo bajo demanda; sin contactos.', benefits: 'Menor riesgo y mayor confianza.', risks: 'Publicidad menos segmentada.', affected: 'Usuarios', principles: ['privacidad', 'autonomia'], limitations: 'Menos ingresos publicitarios.', mitigation: 'Publicidad contextual basada en la receta consultada.' },
      { name: 'Mantener la recolección con mejor aviso', description: 'Conservar los datos y mejorar la política de privacidad.', benefits: 'Conserva los ingresos actuales.', risks: 'El problema de fondo persiste.', affected: 'Usuarios y contactos', principles: ['transparencia'], limitations: 'No reduce la exposición de datos.', mitigation: 'Panel de privacidad para consultar y eliminar datos.' },
    ],
    measures: ['Aplicar minimización: cada dato debe justificar su finalidad.', 'Consentimiento separado y opcional para publicidad.', 'Permitir descargar y eliminar los datos desde la propia app.'],
    questions: ['¿Qué dato podrías eliminar hoy sin afectar la función principal?', '¿Quién protege a las personas cuyos contactos se recogen sin su conocimiento?', '¿Un «acepto» obligatorio puede considerarse libre?'],
  },
  {
    id: 'rechazo-sin-explicacion',
    title: 'Subsidios rechazados por un sistema que no explica',
    tagline: 'Un sistema automatizado que rechaza solicitudes sin explicar sus motivos',
    systemType: 'informacion',
    context:
      'Una entidad pública automatiza la revisión de solicitudes de subsidio de vivienda. El sistema descarta solicitudes por inconsistencias en los documentos y notifica únicamente «solicitud inválida».',
    objective: 'Reducir los tiempos de revisión de solicitudes de subsidio.',
    problem:
      'Las personas no saben qué falló ni cómo corregirlo, y los funcionarios tampoco pueden reconstruir la decisión. La eficiencia se logra a costa de la confianza y del derecho a controvertir.',
    groups: [
      { category: 'usuarios', name: 'Solicitantes del subsidio', description: 'Familias que dependen de la respuesta para acceder a vivienda.' },
      { category: 'vulnerables', name: 'Personas con baja alfabetización digital', description: 'Cometen más errores al cargar documentos.' },
      { category: 'administradores', name: 'Funcionarios de la entidad', description: 'Reciben quejas y no pueden explicar los rechazos.' },
    ],
    principles: ['transparencia', 'responsabilidad', 'confianza', 'inclusion'],
    risks: [
      { category: 'transparencia', description: 'Los rechazos no incluyen motivo ni pasos para corregir.', affected: 'Solicitantes', consequences: 'Pérdida del subsidio por errores subsanables.', preventive: 'Mensajes con causa específica y plazo de corrección.', severity: 'alta' },
      { category: 'exclusion', description: 'El cargue de documentos falla con archivos de baja calidad tomados desde el celular.', affected: 'Personas con baja conectividad o alfabetización digital', consequences: 'Rechazos injustos y mayor brecha de acceso.', preventive: 'Guía de carga, tolerancia a imágenes de baja calidad y atención presencial.', severity: 'media' },
      { category: 'supervision', description: 'Nadie revisa los rechazos automáticos antes de notificarlos.', affected: 'Solicitantes y funcionarios', consequences: 'Errores del sistema se vuelven decisiones definitivas.', preventive: 'Revisión humana de una muestra y de todas las solicitudes impugnadas.', severity: 'alta' },
    ],
    alternatives: [
      { name: 'Rechazo automático con explicación', description: 'Mantener la automatización y devolver el motivo, un plazo de corrección y un canal de apelación.', benefits: 'Rápido y comprensible.', risks: 'Algunos errores del sistema persisten.', affected: 'Solicitantes', principles: ['transparencia', 'confianza'], limitations: 'Requiere reglas claras y bien documentadas.', mitigation: 'Registro de cada decisión con la versión de las reglas.' },
      { name: 'Preclasificación automática y decisión humana', description: 'El sistema marca inconsistencias, pero un funcionario decide los rechazos.', benefits: 'Mayor responsabilidad y menos errores.', risks: 'Menor ahorro de tiempo.', affected: 'Funcionarios y solicitantes', principles: ['supervision', 'responsabilidad'], limitations: 'Requiere más personal.', mitigation: 'Priorizar por riesgo para que el esfuerzo humano sea proporcional.' },
    ],
    measures: ['Todo rechazo informa el motivo y cómo subsanarlo.', 'Registrar las decisiones con fecha, regla aplicada y versión del sistema.', 'Habilitar atención presencial o telefónica como canal alternativo.'],
    questions: ['¿Qué derecho pierde una persona cuando no sabe por qué la rechazaron?', '¿Qué ahorro de tiempo justifica retirar la revisión humana?', '¿Cómo recupera confianza una institución que decide sin explicar?'],
  },
  {
    id: 'memoria-comunitaria',
    title: 'Una plataforma de turismo que publica historias de un barrio',
    tagline: 'Una plataforma que publica imágenes o historias de una comunidad sin participación',
    systemType: 'web',
    context:
      'Una plataforma de turismo cultural publica fotografías, videos y testimonios de habitantes de un barrio con memoria de conflicto. El material fue recogido por visitantes y operadores; la comunidad no revisó cómo se presentan sus historias ni recibe parte de los ingresos.',
    objective: 'Promover rutas de turismo cultural y visibilizar la memoria del barrio.',
    problem:
      'La visibilidad económica convive con la exposición de personas y relatos dolorosos sin su consentimiento informado. Las historias se descontextualizan y la comunidad no decide cómo se representa.',
    groups: [
      { category: 'comunidades', name: 'Habitantes y organizaciones del barrio', description: 'Protagonistas de las historias y de la memoria que se muestra.' },
      { category: 'datos', name: 'Personas fotografiadas o grabadas', description: 'Aparecen en imágenes y videos, incluidos menores.' },
      { category: 'usuarios', name: 'Turistas y visitantes', description: 'Consultan el contenido y reservan recorridos.' },
      { category: 'administradores', name: 'Operadores de la plataforma', description: 'Publican y monetizan el contenido.' },
    ],
    principles: ['dignidad', 'privacidad', 'confianza', 'cuidado'],
    risks: [
      { category: 'privacidad', description: 'Se publican rostros, nombres y testimonios sin consentimiento informado y revocable.', affected: 'Personas fotografiadas y sus familias', consequences: 'Revictimización, exposición y riesgos de seguridad.', preventive: 'Consentimiento por escrito, revocable, con opción de anonimizar y retirar.', severity: 'alta' },
      { category: 'dano', description: 'La narrativa convierte el dolor de la comunidad en un producto turístico.', affected: 'Comunidad del barrio', consequences: 'Pérdida de dignidad y desconfianza hacia las iniciativas externas.', preventive: 'Curaduría compartida con la comunidad y reglas de representación.', severity: 'media' },
      { category: 'conflictos', description: 'Los ingresos benefician a los operadores y no a quienes aportan las historias.', affected: 'Comunidad del barrio', consequences: 'Percepción de explotación y conflictos locales.', preventive: 'Acuerdo de distribución de beneficios y gobernanza compartida.', severity: 'media' },
    ],
    alternatives: [
      { name: 'Contenido curado y aprobado por la comunidad', description: 'Un comité comunitario revisa, aprueba y puede retirar cualquier contenido.', benefits: 'Respeta la identidad y fortalece la confianza.', risks: 'Publicación más lenta y menos volumen.', affected: 'Comunidad y operadores', principles: ['dignidad', 'confianza'], limitations: 'Exige tiempo y recursos para la participación.', mitigation: 'Calendario de revisión y apoyo logístico al comité.' },
      { name: 'Retirar los testimonios y mostrar solo contenido público', description: 'Conservar mapas y obras públicas, sin rostros ni relatos personales.', benefits: 'Riesgo mínimo de exposición.', risks: 'Pierde el valor de la memoria viva.', affected: 'Comunidad y visitantes', principles: ['privacidad', 'cuidado'], limitations: 'Reduce el atractivo de la plataforma.', mitigation: 'Invitar a la comunidad a producir sus propios contenidos.' },
    ],
    measures: ['Consentimiento informado, específico y revocable para cada persona.', 'Gobernanza compartida y distribución acordada de beneficios.', 'Protocolo para retirar contenido con rapidez.'],
    questions: ['¿Quién tiene derecho a contar la historia de una comunidad?', '¿Qué ocurre con una imagen publicada si la persona cambia de opinión?', '¿Cómo se distinguen la visibilización y la explotación?'],
  },
  {
    id: 'agente-sin-supervision',
    title: 'Un agente de IA con acceso total al correo y a la nube',
    tagline: 'Un agente de IA que ejecuta acciones sin supervisión suficiente',
    systemType: 'agente',
    context:
      'Una empresa despliega un agente de IA para «ordenar» el correo y los archivos compartidos de sus empleados. Tiene permisos de lectura, envío y eliminación en toda la cuenta y actúa sin pedir confirmación. Un día elimina carpetas que consideraba duplicadas y envía un resumen a destinatarios equivocados.',
    objective: 'Automatizar la organización de correo y documentos para ahorrar tiempo.',
    problem:
      'El agente tiene más permisos de los que necesita, no deja un registro revisable y sus acciones son irreversibles. La responsabilidad por los errores no está asignada.',
    groups: [
      { category: 'usuarios', name: 'Empleados que delegan en el agente', description: 'Confían en que el agente actúa dentro de lo que pidieron.' },
      { category: 'terceros', name: 'Destinatarios y colegas', description: 'Reciben información que no debían recibir.' },
      { category: 'administradores', name: 'Equipo de TI y seguridad', description: 'Configura los permisos y responde por incidentes.' },
    ],
    principles: ['supervision', 'responsabilidad', 'cuidado', 'privacidad'],
    risks: [
      { category: 'automatizacion', description: 'El agente elimina y envía información sin aprobación previa.', affected: 'Empleados y terceros', consequences: 'Pérdida de archivos y divulgación indebida de información.', preventive: 'Aprobación humana para acciones irreversibles y papelera con recuperación.', severity: 'alta' },
      { category: 'supervision', description: 'No existe un registro claro de lo que hizo el agente ni un freno inmediato.', affected: 'Empleados y administradores', consequences: 'Imposible reconstruir los hechos o detener el daño.', preventive: 'Registro de acciones, límite de operaciones por hora y botón de parada.', severity: 'alta' },
      { category: 'privacidad', description: 'El agente lee todo el correo, incluidos mensajes personales y confidenciales.', affected: 'Empleados y terceros', consequences: 'Acceso excesivo a datos sensibles.', preventive: 'Permisos mínimos, carpetas acotadas y exclusiones explícitas.', severity: 'media' },
    ],
    alternatives: [
      { name: 'Agente que propone y la persona aprueba', description: 'El agente prepara un plan de cambios y el empleado lo aprueba antes de ejecutarlo.', benefits: 'Control claro y reversibilidad.', risks: 'Se ahorra menos tiempo.', affected: 'Empleados', principles: ['supervision', 'autonomia'], limitations: 'Exige atención humana constante.', mitigation: 'Aprobación por lotes y por categoría de acción.' },
      { name: 'Agente autónomo con límites estrictos', description: 'Actúa solo sobre acciones reversibles y de bajo impacto, con permisos mínimos y registro completo.', benefits: 'Mantiene la automatización.', risks: 'Un error en el límite puede pasar desapercibido.', affected: 'Empleados y TI', principles: ['supervision', 'cuidado'], limitations: 'Requiere definir qué es «bajo impacto».', mitigation: 'Auditoría semanal del registro y revisión de permisos.' },
    ],
    measures: ['Permisos mínimos y por tarea, nunca acceso total por defecto.', 'Aprobación humana para borrar, enviar fuera de la organización o modificar permisos.', 'Registro de acciones, botón de parada y plan de recuperación.'],
    questions: ['¿Quién responde cuando el agente se equivoca: la persona, el equipo de TI o el proveedor?', '¿Qué acciones nunca deberían ser automáticas?', '¿Cómo se mantiene el criterio humano si el agente casi siempre acierta?'],
  },
  {
    id: 'seleccion-candidatos',
    title: 'Un sistema de selección que favorece perfiles «conocidos»',
    tagline: 'Un sistema de selección de candidatos con conflicto de intereses y criterios sesgados',
    systemType: 'informacion',
    context:
      'Una entidad contrata un sistema para preseleccionar candidatos a becas y cargos. Los criterios de puntuación los define un comité cuyos miembros tienen vínculos con instituciones que aportan muchos candidatos. El sistema da más peso a ciertas universidades y a la «recomendación institucional».',
    objective: 'Preseleccionar candidatos de forma rápida y objetiva.',
    problem:
      'Los criterios no son neutrales: reflejan intereses de quienes los definieron, y la automatización les da apariencia de objetividad. Las personas sin esos vínculos quedan en desventaja sin saberlo.',
    groups: [
      { category: 'usuarios', name: 'Candidatos a becas y cargos', description: 'Son evaluados por el sistema.' },
      { category: 'vulnerables', name: 'Candidatos de instituciones poco reconocidas o de regiones apartadas', description: 'Pierden puntos por criterios de prestigio.' },
      { category: 'administradores', name: 'Comité de selección', description: 'Define criterios y decide con apoyo del sistema.' },
      { category: 'terceros', name: 'Ciudadanía que financia o confía en el proceso', description: 'Espera un proceso imparcial.' },
    ],
    principles: ['justicia', 'responsabilidad', 'transparencia', 'confianza'],
    risks: [
      { category: 'conflictos', description: 'Quienes definen los criterios tienen intereses en el resultado.', affected: 'Candidatos sin vínculos institucionales', consequences: 'Decisiones parciales y pérdida de legitimidad.', preventive: 'Declarar conflictos de interés, abstención y revisión externa de criterios.', severity: 'alta' },
      { category: 'discriminacion', description: 'El peso de la universidad y de la recomendación penaliza a perfiles con trayectorias distintas.', affected: 'Candidatos de instituciones poco reconocidas', consequences: 'Desigualdad de oportunidades.', preventive: 'Evaluar competencias con rúbricas públicas y revisar el impacto por grupo.', severity: 'alta' },
      { category: 'transparencia', description: 'Los criterios y sus pesos no se publican.', affected: 'Candidatos', consequences: 'Imposible impugnar o entender el resultado.', preventive: 'Publicar los criterios y entregar a cada candidato su evaluación.', severity: 'media' },
    ],
    alternatives: [
      { name: 'Rúbrica pública con evaluación a ciegas', description: 'Criterios publicados, datos de la institución ocultos en la primera etapa y revisión por pares externos.', benefits: 'Reduce el sesgo de prestigio y aumenta la legitimidad.', risks: 'Más trabajo de diseño y revisión.', affected: 'Candidatos y comité', principles: ['justicia', 'transparencia'], limitations: 'No elimina todos los sesgos.', mitigation: 'Análisis posterior de resultados por grupo.' },
      { name: 'Mantener el sistema con declaración de conflictos', description: 'Conservar los criterios y exigir declaración de conflictos y abstención.', benefits: 'Cambio simple y rápido.', risks: 'Los sesgos de los criterios permanecen.', affected: 'Candidatos', principles: ['responsabilidad'], limitations: 'Depende de la honestidad de las declaraciones.', mitigation: 'Revisión externa anual de los criterios.' },
    ],
    measures: ['Declaración y gestión pública de los conflictos de interés.', 'Criterios publicados, con justificación de cada peso.', 'Seguimiento periódico de los resultados por grupo y vía de reclamación.'],
    questions: ['¿Qué intereses podrían estar detrás de cada criterio de puntuación?', '¿Por qué la automatización puede dar apariencia de objetividad a un sesgo?', '¿Qué haría que los candidatos confíen en este proceso?'],
  },
]

export const CASE_BY_ID: Record<string, CaseStudy> = Object.fromEntries(CASES.map((c) => [c.id, c]))

/** Crea una evaluación editable a partir de un caso. Las valoraciones de principios quedan sin evaluar. */
export function evaluationFromCase(c: CaseStudy): Evaluation {
  return newEvaluation({
    sourceCaseId: c.id,
    project: {
      name: `Caso: ${c.title}`,
      type: c.systemType,
      description: c.context,
      objective: c.objective,
      context: `Punto de partida educativo de ÉticaLab. Problema ético: ${c.problem}`,
    },
    groups: c.groups.map((g) => newGroup(g)),
    risks: c.risks.map((r) => newRisk(r)),
    alternatives: c.alternatives.map((a) => newAlternative(a)),
  })
}
