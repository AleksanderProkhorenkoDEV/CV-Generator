/**
 * DATOS DEL CV — el ÚNICO archivo que hay que editar.
 *
 * Modelo de ejemplo: sustituye los valores de ejemplo ("Your Name",
 * "you@example.com", …) por los tuyos y borra este aviso antes de compartir.
 *
 * Convenciones generales:
 *  - Todo campo con contenido traducible es `{ en: '…', es: '…' }`.
 *  - Puedes usar HTML básico (`<b>`, `<a>`, `&mdash;`) en bullets, summary,
 *    notes y tech. El texto se escapa solo en nombres y organizaciones.
 *  - Campos opcionales: `variants` (filtrar por perfil), `repo`, `url`,
 *    `note`, `date`.
 */

/* ─────────────────────────────  IDENTIDAD  ───────────────────────────── */

// Slug para el nombre de los ficheros de salida: <slug>_<Perfil>_<IDIOMA>.html
// Usa solo letras, números, guiones e guiones bajos (sin espacios ni acentos).
export const SLUG = 'Your_Name';

export const CONTACT = {
  // Tu nombre tal y como aparece al inicio del CV.
  name: 'Your Name',
  email: 'you@example.com',
  phone: '+00 000 000 000',
  city: { en: 'Your City, Country', es: 'Tu Ciudad, País' },
  // Enlaces que se muestran en la cabecera, en orden, de 3 en 3 por línea.
  links: [
    { label: { en: 'Portfolio', es: 'Portfolio' }, url: 'https://your-portfolio.example/' },
    { label: { en: 'GitHub', es: 'GitHub' }, url: 'https://github.com/youruser' },
    { label: { en: 'LinkedIn', es: 'LinkedIn' }, url: 'https://www.linkedin.com/in/youruser/' },
  ],
  // Nombre del archivo de foto circular de la cabecera. Opcional: si el
  // archivo no existe, el CV se genera sin foto.
  photoFile: 'foto.png',
};

/* ─────────────────────────────  IDIOMAS  ───────────────────────────── */

// Sección "Languages". Para cada idioma que quieras listar: nombre + nivel.
// Los niveles van en el idioma del propio CV (en: "Native", es: "Nativo"…).
export const LANGUAGES = {
  en: [
    { name: 'Spanish', level: 'Native' },
    { name: 'English', level: 'B2 proficiency' },
  ],
  es: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'B2 en curso' },
  ],
};

/* ─────────────────────────────  EXPERIENCIA  ───────────────────────────── */

/**
 * Lista ordenada de más reciente a más antiguo.
 * Campos:
 *  - org, role, loc, dates  → obligatorios.
 *  - bullets                → array de <li>.
 *  - variants               → OPCIONAL: array con los `file` de VARIANTS donde
 *                             debe aparecer. Si se omite, aparece en todos.
 *  - repo                   → OPCIONAL: enlace al repositorio del proyecto.
 */
export const EXPERIENCE = {
  en: [
    {
      org: 'Company A',
      role: 'Full Stack Developer',
      loc: 'Your City, Country',
      dates: 'Feb 2025 – Jun 2025',
      bullets: [
        'Built the <b>REST API</b> of a web application with <b>framework</b> and role-based access control.',
        'Implemented authentication end to end with <b>JWT</b>.',
        'Wrote unit and integration tests keeping coverage above the team standard.',
      ],
    },
    {
      org: 'Non-tech Job',
      role: 'Role Title',
      loc: 'Your City, Country',
      dates: 'Aug 2024 – Sep 2024',
      // Solo aparece en el perfil "General".
      variants: ['General'],
      bullets: [
        'Customer-facing responsibilities summarised in one or two bullets.',
      ],
    },
  ],
  es: [
    {
      org: 'Empresa A',
      role: 'Desarrollador Full Stack',
      loc: 'Tu Ciudad, País',
      dates: 'feb. 2025 – jun. 2025',
      bullets: [
        'Construí la <b>API REST</b> de una aplicación web con <b>framework</b> y control de acceso por roles.',
        'Implementé la autenticación de extremo a extremo con <b>JWT</b>.',
        'Escribí tests unitarios y de integración manteniendo la cobertura por encima del estándar del equipo.',
      ],
    },
    {
      org: 'Trabajo no técnico',
      role: 'Puesto',
      loc: 'Tu Ciudad, País',
      dates: 'ago. 2024 – sep. 2024',
      variants: ['General'],
      bullets: [
        'Responsabilidades de trato con el cliente resumidas en uno o dos bullets.',
      ],
    },
  ],
};

/* ─────────────────────────────  PROYECTOS  ───────────────────────────── */

/** Aparecen en todos los perfiles, en este orden. */
export const PROJECTS = {
  en: [
    {
      name: 'Project One — Short description of the stack',
      tech: 'Tech 1 · Tech 2 · Tech 3',
      dates: 'Sep 2025 – Oct 2025',
      repo: 'https://github.com/youruser/project-one',
      bullets: [
        'One-paragraph description of what the project does and why it exists.',
        '<b>40 tests in 5 classes</b>, one technique each: unit, integration and a smoke test.',
      ],
    },
  ],
  es: [
    {
      name: 'Proyecto Uno — Descripción corta del stack',
      tech: 'Tech 1 · Tech 2 · Tech 3',
      dates: 'sep. 2025 – oct. 2025',
      repo: 'https://github.com/youruser/project-one',
      bullets: [
        'Párrafo de descripción: qué hace el proyecto y por qué existe.',
        '<b>40 tests en 5 clases</b>, una técnica por clase: unitarios, integración y un test de humo.',
      ],
    },
  ],
};

/* ─────────────────────────────  BLOG / PUBLICACIONES  ───────────────────────────── */

/**
 * Sección "Writing" (opcional: quita 'writing' del `order` de cada perfil).
 * `domain` se muestra junto al título de cada entrada.
 * Si no publicas nada, deja los arrays vacíos `[]` y no añadas 'writing'.
 */
export const WRITING = {
  domain: 'blog.example.com',
  en: [
    {
      title: 'Post Title',
      date: 'Oct 2025',
      url: 'https://blog.example.com/post-title',
      note: 'One-line note about what the post covers, with <b>keywords</b> in bold.',
    },
  ],
  es: [
    {
      title: 'Título del post',
      date: 'oct. 2025',
      url: 'https://blog.example.com/post-title',
      note: 'Nota de una línea sobre el contenido del post, con <b>palabras clave</b> en negrita.',
    },
  ],
};

/* ─────────────────────────────  EDUCACIÓN  ───────────────────────────── */

export const EDUCATION = {
  en: [
    {
      org: 'School / University',
      role: 'Degree or Certificate Title',
      dates: 'Sep 2022 – Jun 2024',
      url: 'https://institution.example/',
      note: 'Optional note: EQF level, honours, or nothing.',
    },
  ],
  es: [
    {
      org: 'Centro / Universidad',
      role: 'Título o Certificado',
      dates: 'sep. 2022 – jun. 2024',
      url: 'https://instituto.example/',
      note: 'Nota opcional: nivel EQF, matrícula, o nada.',
    },
  ],
};

/* ─────────────────────────────  CERTIFICACIONES  ───────────────────────────── */

/**
 * Igual que EXPERIENCE: `variants` filtra el perfil en el que aparece.
 * Deja `date: ''` si no tiene fecha.
 */
export const CERTS = {
  en: [
    {
      issuer: 'Issuer',
      name: 'Certificate Name',
      date: 'Mar 2025',
      note: 'Hours and topics covered.',
      variants: ['General'],
    },
  ],
  es: [
    {
      issuer: 'Entidad',
      name: 'Nombre del certificado',
      date: 'mar. 2025',
      note: 'Horas y temas cubiertos.',
      variants: ['General'],
    },
  ],
};

/* ─────────────────────────────  PERFILES / VARIANTES  ───────────────────────────── */

/**
 * Cada clave genera 2 CVs (en + es). Propiedades:
 *  - file        → etiqueta usada en `variants` y en el nombre del fichero.
 *  - title       → puesto que va bajo tu nombre, por idioma.
 *  - summary     → párrafo de apertura, por idioma. Puede usar ${CONTACT.city[lang]}.
 *  - skills      → pares [etiqueta, lista técnica], por idioma.
 *  - order       → secciones y su orden: summary, skills, experience, projects,
 *                  writing, education, certs, languages.
 *  - maxBullets  → OPCIONAL: recorta cada puesto a N bullets (para CVs largos).
 */
export const VARIANTS = {
  General: {
    file: 'General',
    title: { en: 'Software Developer', es: 'Desarrollador de Software' },
    summary: {
      en: `Two- to four-sentence pitch: strongest technologies in <b>bold</b>, one flagship delivery, one non-technical differentiator, languages level. Based in ${CONTACT.city.en}; open to remote work.`,
      es: `Pitch de 2 a 4 frases: tecnologías principales en <b>negrita</b>, un entregable destacado, un diferenciador no técnico, nivel de idiomas. Basado en ${CONTACT.city.es}; abierto a trabajo remoto.`,
    },
    skills: {
      en: [
        ['Languages', 'Language 1, Language 2, SQL'],
        ['Front end', 'Framework, framework, CSS'],
        ['Back end', 'Framework, REST APIs, authentication'],
        ['Databases', 'Database'],
        ['Tools', 'Git, Docker, CI/CD'],
        ['Other experience', 'Customer service, team coordination'],
      ],
      es: [
        ['Lenguajes', 'Lenguaje 1, Lenguaje 2, SQL'],
        ['Front end', 'Framework, framework, CSS'],
        ['Back end', 'Framework, APIs REST, autenticación'],
        ['Bases de datos', 'Base de datos'],
        ['Herramientas', 'Git, Docker, CI/CD'],
        ['Otra experiencia', 'Atención al cliente, coordinación de equipo'],
      ],
    },
    order: ['summary', 'skills', 'experience', 'projects', 'education', 'certs', 'languages'],
    maxBullets: 4, // Con muchos empleos, 3-4 bullets por puesto caben en 2 páginas.
  },

  Specialist: {
    file: 'Specialist',
    title: { en: 'Specialist Developer — Your Focus', es: 'Desarrollador Especialista — Tu Enfoque' },
    summary: {
      en: `Specialised pitch for this profile, leading with the most relevant work and stack. Based in ${CONTACT.city.en}; open to remote work.`,
      es: `Pitch especializado para este perfil, encabezado por el trabajo y el stack más relevantes. Basado en ${CONTACT.city.es}; abierto a trabajo remoto.`,
    },
    skills: {
      en: [
        ['Core stack', 'The specialist stack, in priority order'],
        ['Practice', 'Architecture, testing, accessibility, etc.'],
        ['Secondary', 'The supporting technologies'],
        ['Tools & practices', 'Git, Docker, TDD, CI/CD'],
      ],
      es: [
        ['Stack principal', 'El stack del especialista, por orden de prioridad'],
        ['Práctica', 'Arquitectura, testing, accesibilidad, etc.'],
        ['Secundario', 'Tecnologías de apoyo'],
        ['Herramientas y prácticas', 'Git, Docker, TDD, CI/CD'],
      ],
    },
    order: ['summary', 'skills', 'projects', 'experience', 'education', 'certs', 'languages'],
  },
  // Duplica el bloque de arriba por cada perfil extra (p. ej. Frontend,
  // Backend_Java, Backend_Node…). Cada uno genera un par de ficheros.
};
