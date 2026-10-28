/**
 * MMotor generador de CVs.
 *
 * Sin dependencias. Ejecutar:  node build.mjs
 *
 * ¿Cómo funciona?
 *   1. Este script importa los datos desde `data.mjs` (el único archivo
 *      que hay que editar).
 *   2. Para cada variante/perfil definida en `VARIANTS` y para cada idioma,
 *      genera un HTML listo para imprimir a PDF (A4).
 *   3. Los ficheros de salida se nombran `<slug>_<Perfil>_<IDIOMA>.html`,
 *      donde `slug` se define en `data.mjs`.
 *
 * Para compartir tu configuración sin datos personales: comparte este archivo
 * tal cual y sustituye el contenido de `data.mjs` por esta plantilla con los
 * valores de ejemplo.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Los datos viven en un archivo aparte para separar contenido del motor.
import {
  SLUG,
  CONTACT,
  EXPERIENCE,
  PROJECTS,
  WRITING,
  EDUCATION,
  CERTS,
  LANGUAGES,
  VARIANTS,
} from './data.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));

/* ─────────────────────────────  MAQUETACIÓN  ───────────────────────────── */

// CSS de impresión. Notas:
//  - `@page` fija el tamaño y márgenes del PDF.
//  - El español ocupa ~15 % más que el inglés; la regla html[lang="es"]
//    reduce ligeramente la tipografía para que no se desborde a una 3.ª página.
//  - `.nb` (nowrap) evita que un guion de fin de línea parta tokens como
//    rutas de API; si se parten los ATS dejan de reconocerlas.
const CSS = `
@page { size: A4; margin: 13mm 15mm 12mm 15mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9.45pt;
  line-height: 1.32;
  color: #1b1b1b;
  hyphens: none;
  -webkit-hyphens: none;
  text-align: left;
}
html[lang="es"] body { font-size: 9.25pt; line-height: 1.29; }

a { color: #1b1b1b; text-decoration: none; }

header { display: flex; align-items: flex-start; gap: 6mm; border-bottom: 1.6pt solid #1b1b1b; padding-bottom: 3mm; }
header .who { flex: 1 1 auto; }
h1 { font-size: 18pt; font-weight: bold; letter-spacing: -0.2pt; line-height: 1.1; }
.role { font-size: 11pt; color: #0b5c8a; font-weight: bold; margin-top: 1.2mm; }
.contact { margin-top: 2mm; font-size: 8.7pt; line-height: 1.45; color: #333; }
.contact .cline { white-space: nowrap; }
.contact .nw { display: inline-block; }
.contact .sep { color: #999; padding: 0 1.2mm; }
.foto { width: 25mm; height: 25mm; border-radius: 50%; object-fit: cover; flex: 0 0 auto; }

section { margin-top: 2.4mm; break-inside: auto; }
h2 {
  font-size: 9.2pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.9pt;
  color: #0b5c8a; border-bottom: 0.8pt solid #0b5c8a; padding-bottom: 0.8mm; margin-bottom: 2.2mm;
}
p.body { text-align: left; }

.item { margin-bottom: 2mm; break-inside: avoid; }
.item:last-child { margin-bottom: 0; }
.head { display: flex; align-items: baseline; gap: 3mm; }
.head .t { flex: 1 1 auto; }
.head .d { flex: 0 0 auto; font-size: 8.8pt; color: #555; white-space: nowrap; }
.org { font-weight: bold; font-size: 10.2pt; }
.role-line { font-size: 9.45pt; }
.loc { font-size: 8.7pt; color: #666; margin-top: 0.2mm; }
ul { margin: 1.1mm 0 0 4.2mm; }
li { margin-bottom: 0.35mm; }
li::marker { color: #0b5c8a; }
.tech { font-size: 8.6pt; color: #555; margin-top: 0.6mm; }
.note { font-size: 8.6pt; color: #666; margin-top: 0.3mm; }

.skills { margin-bottom: 1.2mm; }
.skills .k { font-weight: bold; }
.skills .v { color: #333; }

.langs { display: flex; gap: 6mm; }
.langs div { flex: 0 0 auto; }
.langs .n { font-weight: bold; }
.langs .l { color: #555; font-size: 8.8pt; }

.nb { white-space: nowrap; }
`;

/* ─────────────────────────────  RENDER  ───────────────────────────── */

/**
 * Renderiza un CV completo en HTML para una variante y un idioma.
 * @param doc   Una de las variantes de VARIANTS (con title, summary, skills, order…)
 * @param lang  'en' | 'es'
 */
function render(doc, lang) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const L = {
    en: {
      summary: 'Profile',
      experience: 'Professional Experience',
      projects: 'Selected Projects',
      writing: 'Writing',
      education: 'Education',
      certs: 'Certifications',
      skills: 'Technical Skills',
      languages: 'Languages',
      native: 'Native',
      englishNote: 'English level (from data.mjs LANGUAGES)',
      repoLabel: 'Repository',
    },
    es: {
      summary: 'Perfil profesional',
      experience: 'Experiencia profesional',
      projects: 'Proyectos',
      writing: 'Publicaciones',
      education: 'Formación',
      certs: 'Certificaciones',
      skills: 'Conocimientos técnicos',
      languages: 'Idiomas',
      native: 'Nativo',
      englishNote: 'Nivel de inglés (de data.mjs LANGUAGES)',
      repoLabel: 'Repositorio',
    },
  }[lang];

  // Cada segmento de contacto va en su propia línea y con nowrap: ningún
  // parser puede partir el teléfono ni una URL a mitad de texto.
  const nw = (s) => `<span class="nw">${s}</span>`;
  const strip = (u) => u.replace(/^https?:\/\//, '');
  const line1 = [CONTACT.city[lang], `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`, CONTACT.phone]
    .map(nw)
    .join(`<span class="sep">|</span>`);
  // Los enlaces se reparten en líneas de 3 en 3, conservando el orden definido.
  const linkLines = [];
  for (let i = 0; i < CONTACT.links.length; i += 3) {
    linkLines.push(
      CONTACT.links.slice(i, i + 3).map((l) => nw(`<a href="${l.url}">${strip(l.url)}</a>`)).join(`<span class="sep">|</span>`)
    );
  }
  const contactLine = linkLines
    .map((l) => `<div class="cline">${l}</div>`)
    .join('');

  // La foto es opcional: solo se muestra si existe photo.png junto al script.
  const hasPhoto = fs.existsSync(path.join(DIR, CONTACT.photoFile));
  const photoHtml = hasPhoto ? `<img class="foto" src="${CONTACT.photoFile}" alt="">` : '';

  const parts = [];
  parts.push(`<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : 'es'}">
<head>
<meta charset="utf-8">
<title>${esc(doc.title[lang])} — ${esc(CONTACT.name)}</title>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="who">
    <h1>${esc(CONTACT.name)}</h1>
    <div class="role">${doc.title[lang]}</div>
    <div class="contact">${contactLine}</div>
  </div>
  ${photoHtml}
</header>`);

  // Cada sección es una clave de `doc.order`; así cada perfil decide el orden.
  const block = {
    summary: () => `<section><h2>${L.summary}</h2><p class="body">${doc.summary[lang]}</p></section>`,

    skills: () =>
      `<section><h2>${L.skills}</h2>` +
      doc.skills[lang]
        .map(([k, v]) => `<div class="skills"><span class="k">${k}:</span> <span class="v">${v}</span></div>`)
        .join('') +
      `</section>`,

    experience: () =>
      `<section><h2>${L.experience}</h2>` +
      EXPERIENCE[lang]
        // Si la entrada define `variants`, solo aparece en esos perfiles.
        .filter((e) => !e.variants || e.variants.includes(doc.file))
        .map(
          (e) => {
            // `maxBullets` de la variante recorta los listados largos
            // para que el CV quepa en 2 páginas.
            const bl = doc.maxBullets ? e.bullets.slice(0, doc.maxBullets) : e.bullets;
            return `<div class="item">
        <div class="head">
          <span class="t"><span class="org">${esc(e.org)}</span> &mdash; <span class="role-line">${e.role}</span></span>
          <span class="d">${e.dates}</span>
        </div>
        <div class="loc">${e.loc}</div>
        ${e.repo ? `<div class="loc">${L.repoLabel}: <a href="${e.repo}">${e.repo.replace(/^https?:\/\//, '')}</a></div>` : ''}
        <ul>${bl.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>`;
          }
        )
        .join('') +
      `</section>`,

    projects: () =>
      `<section><h2>${L.projects}</h2>` +
      PROJECTS[lang]
        .map(
          (p) => `<div class="item">
        <div class="head">
          <span class="t"><span class="org">${p.name}</span></span>
          <span class="d">${p.dates}</span>
        </div>
        <div class="tech">${p.tech}</div>
        ${p.repo ? `<div class="loc"><a href="${p.repo}">${p.repo.replace(/^https?:\/\//, '')}</a></div>` : ''}
        <ul>${p.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>`
        )
        .join('') +
      `</section>`,

    writing: () =>
      `<section><h2>${L.writing}</h2>` +
      WRITING[lang]
        .map(
          (w) => `<div class="item">
        <div class="head">
          <span class="t"><a href="${w.url}"><span class="org">${w.title}</span></a> <span class="role-line">— ${WRITING.domain ?? ''}</span></span>
          <span class="d">${w.date}</span>
        </div>
        <div class="note">${w.note}</div>
      </div>`
        )
        .join('') +
      `</section>`,

    education: () =>
      `<section><h2>${L.education}</h2>` +
      EDUCATION[lang]
        .map(
          (e) => `<div class="item">
        <div class="head">
          <span class="t"><span class="org">${esc(e.org)}</span> &mdash; <span class="role-line">${e.role}</span></span>
          <span class="d">${e.dates}</span>
        </div>
        ${e.url ? `<div class="loc"><a href="${e.url}">${e.url.replace(/^https?:\/\//, '')}</a></div>` : ''}
        ${e.note ? `<div class="note">${e.note}</div>` : ''}
      </div>`
        )
        .join('') +
      `</section>`,

    certs: () =>
      `<section><h2>${L.certs}</h2>` +
      CERTS[lang]
        .filter((c) => !c.variants || c.variants.includes(doc.file))
        .map(
          (c) => `<div class="item">
        <div class="head">
          <span class="t"><span class="org">${c.name}</span> <span class="role-line">&mdash; ${esc(c.issuer)}</span></span>
          <span class="d">${c.date}</span>
        </div>
        <div class="note">${c.note}</div>
      </div>`
        )
        .join('') +
      `</section>`,

    languages: () =>
      `<section><h2>${L.languages}</h2>
        <div class="langs">
          ${LANGUAGES[lang].map((lm) => `<div><span class="n">${lm.name}</span> <span class="l">${lm.level}</span></div>`).join('\n          ')}
        </div>
      </section>`,
  };

  for (const key of doc.order) parts.push(block[key]());

  parts.push('</body>\n</html>');
  return parts.join('\n');
}

/* ─────────────────────────────  EJECUCIÓN  ───────────────────────────── */

let n = 0;
for (const [key, doc] of Object.entries(VARIANTS)) {
  for (const lang of ['en', 'es']) {
    const html = render(doc, lang);
    // Nombre de salida parametrizado: <slug>_<Perfil>_<IDIOMA>.html
    const out = path.join(DIR, `${SLUG}_${key}_${lang.toUpperCase()}.html`);
    fs.writeFileSync(out, html, 'utf8');
    n++;
    console.log(`OK  ${path.basename(out)}  (${(html.length / 1024).toFixed(1)} KB)`);
  }
}
console.log(`\n${n} CVs generados en ${DIR}`);
