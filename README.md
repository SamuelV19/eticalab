# ÉticaLab · Laboratorio de Tecnología Responsable

ÉticaLab es una plataforma web que ayuda a estudiantes y profesionales de Ingeniería Informática a analizar las implicaciones éticas de sus decisiones tecnológicas **antes** de llevarlas a producción: identificar riesgos, reconocer a las personas afectadas, evaluar principios éticos, comparar alternativas y documentar decisiones responsables.

Nació como actividad académica del V Congreso Internacional de Ética («Habitar juntos: ética, dignidad y cuidado para una convivencia plural», 22 y 23 de octubre de 2026). El proyecto no resume las ponencias: traduce sus temáticas en funciones de una herramienta (ver la sección «Fundamento ético» dentro de la aplicación).

> Es una herramienta **educativa**. No certifica que un sistema sea ético, seguro o justo, ni calcula un puntaje de ética. Las valoraciones son autoevaluaciones que requieren criterio humano.

## 1. Requisitos previos

- Node.js 18 o superior (probado con Node 22).
- npm 9 o superior.

## 2. Instalación

```bash
npm install
```

## 3. Ejecución en desarrollo

```bash
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## 4. Compilación de producción

```bash
npm run build
```

Ejecuta la verificación de tipos de TypeScript y genera la carpeta `dist/`.

## 5. Vista previa local

```bash
npm run preview
```

## 6. Pruebas

```bash
npm test
```

Incluye pruebas de lógica (validación, importación, persistencia, análisis) y de flujo de interfaz (crear, guardar, editar, eliminar, importar, restablecer).

## 7. Estructura del proyecto

```
eticalab/
├── public/                 Favicon y _redirects (Netlify)
├── src/
│   ├── components/         Componentes reutilizables (Layout, ui, Toast, tabla comparativa…)
│   │   └── wizard/         Las seis etapas del evaluador
│   ├── pages/              Dashboard, Evaluaciones, Evaluador, Informe, Casos, Matriz, Fundamento, Ajustes
│   ├── data/               Principios, taxonomías, casos prácticos y matriz de trazabilidad
│   ├── types/              Modelo de datos TypeScript
│   ├── utils/              Persistencia, validación, análisis, fábrica de objetos, descargas
│   ├── hooks/              useEvaluations (datos reactivos)
│   └── test/               Pruebas con Vitest y Testing Library
├── index.html, vite.config.ts, tailwind.config.js, tsconfig.json
├── vercel.json, netlify.toml
└── package.json
```

## 8. Funcionalidades

- **Panel**: indicadores calculados con datos reales, evaluaciones recientes, actividad y los diez principios. Estado vacío con ejemplos.
- **Evaluador por etapas**: proyecto, personas afectadas, riesgos, valoración de diez principios, alternativas con comparación visual y decisión final. Guarda borradores y retoma donde quedaste.
- **Casos prácticos**: seis casos educativos completos que se convierten en una evaluación editable (las valoraciones de principios empiezan «no evaluadas»).
- **Matriz de evaluación ética**: estado de los diez principios con observaciones, recomendaciones y edición. No hay puntuación total; el único indicador agregado (principios valorados) incluye una nota sobre sus límites.
- **Historial**: crear, consultar, editar, eliminar (con confirmación), buscar por nombre, filtrar por tipo y estado, ordenar por fecha.
- **Informe**: se genera con los datos reales y señala lo no evaluado y los aspectos pendientes. Se imprime o se guarda como PDF desde el navegador (vista de impresión dedicada, sin dependencias).
- **Fundamento ético**: matriz de trazabilidad temática → problema inferido → principio → funcionalidad → beneficio, y limitaciones.
- **Ajustes y datos**: información de almacenamiento, exportación e importación JSON validada, restablecimiento con confirmación y notas de privacidad.
- **Accesibilidad**: etiquetas de formulario, navegación por teclado, foco visible, enlace «Saltar al contenido», estados no codificados solo por color, respeto de `prefers-reduced-motion`.

## 9. Persistencia y privacidad

- Los datos se guardan en `localStorage` bajo la clave `eticalab:evaluaciones:v1`.
- **Permanecen en el navegador** donde se crearon y **no se sincronizan** entre dispositivos ni navegadores. Borrar los datos del sitio o usar una ventana privada los elimina.
- No hay servidor, cuentas, analítica ni llamadas a APIs externas. Las fuentes tipográficas están incluidas en el paquete.
- Los datos leídos se validan: los registros corruptos se descartan sin romper la aplicación.
- Recomendación: describe grupos de personas, no personas reales.

## 10. Importación y exportación

En **Ajustes y datos**:

- *Exportar a JSON* descarga todas las evaluaciones (`{ app: "eticalab", version: 1, evaluations: [...] }`). También se puede exportar una sola evaluación desde su informe.
- *Importar copia* valida el archivo (JSON correcto, forma esperada, máximo 5 MB), omite registros inválidos, normaliza valores desconocidos y permite **combinar** con los datos actuales o **reemplazarlos**.

## 11. Despliegue

### Vercel
1. Sube el repositorio a GitHub.
2. En Vercel: *Add New → Project*, importa el repositorio.
3. Framework: Vite (se detecta solo). Build: `npm run build`. Output: `dist`.
4. `vercel.json` ya redirige todas las rutas a `index.html`.

### Netlify
1. *Add new site → Import an existing project* y elige el repositorio.
2. Build command: `npm run build`. Publish directory: `dist` (ya está en `netlify.toml`).
3. `netlify.toml` y `public/_redirects` ya gestionan la navegación de la SPA.

### Otros hosts estáticos
Sirve el contenido de `dist/` y redirige cualquier ruta a `index.html`.

### Subir a GitHub
```bash
git init
git add .
git commit -m "ÉticaLab: versión inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/eticalab.git
git push -u origin main
```

## 12. Limitaciones conocidas

- Sin sincronización ni colaboración: cada navegador tiene sus propios datos.
- El almacenamiento local tiene un límite (alrededor de 5 MB según el navegador).
- El PDF se genera con la función de impresión del navegador («Guardar como PDF»); su aspecto puede variar un poco entre navegadores.
- Los diez principios son una selección práctica, no una lista exhaustiva ni un marco normativo.
- Los avisos automáticos solo detectan vacíos y posibles inconsistencias de documentación; no valoran la calidad ética del contenido.
- Los casos prácticos son ejemplos educativos inventados para la plataforma; no describen hechos reales ni se atribuyen a los ponentes.
- La interfaz está en español.
