# Generador de CVs (build.mjs + data.mjs)

Generador de currículums **sin dependencias**: escribes tus datos una vez en un fichero y obtienes un CV en HTML, listo para imprimir a PDF (A4), por cada **perfil** y cada **idioma** (inglés y español).

```bash
node build.mjs
```

No hay `npm install`, ni bundlers, ni plantillas externas. Solo Node.js (con soporte de módulos ES) y un navegador para exportar a PDF.

---

## Qué hace cada fichero

| Fichero | Rol | ¿Se edita? |
|---|---|---|
| `data.mjs` | **El contenido**: contacto, experiencia, proyectos, estudios, certificaciones, idiomas y perfiles. | Sí, es el único que hay que tocar. |
| `build.mjs` | **El motor**: lee `data.mjs`, aplica el CSS de impresión y escribe los HTML. | No (salvo que quieras cambiar el diseño). |

La idea es separar **contenido** de **maquetación**. Puedes compartir `build.mjs` tal cual y sustituir `data.mjs` por la plantilla de ejemplo, sin exponer datos personales.

---

## Cómo funciona

1. `build.mjs` importa las constantes exportadas por `data.mjs` (`SLUG`, `CONTACT`, `EXPERIENCE`, `PROJECTS`, `WRITING`, `EDUCATION`, `CERTS`, `LANGUAGES`, `VARIANTS`).
2. Recorre cada entrada de `VARIANTS` y, para cada una, los idiomas `en` y `es`.
3. La función `render(doc, lang)` construye el HTML completo: cabecera con nombre, puesto, contacto y foto, y después las secciones en el orden que indique el perfil.
4. Escribe un fichero por combinación con este nombre:

```
<SLUG>_<Perfil>_<IDIOMA>.html
```

Con la plantilla de ejemplo se generan 4 ficheros:

```
Your_Name_General_EN.html
Your_Name_General_ES.html
Your_Name_Specialist_EN.html
Your_Name_Specialist_ES.html
```

5. Abre el HTML en el navegador y usa **Imprimir → Guardar como PDF**. El CSS (`@page`, A4, márgenes) ya deja el documento preparado.

---

## Estructura de `data.mjs`

Todo el contenido traducible tiene la forma `{ en: '…', es: '…' }`. En bullets, `summary`, `note` y `tech` se admite HTML básico (`<b>`, `<a>`, `&mdash;`). Los nombres y organizaciones sí se escapan.

| Constante | Qué contiene |
|---|---|
| `SLUG` | Prefijo de los ficheros de salida. Solo letras, números, `-` y `_`. |
| `CONTACT` | Nombre, email, teléfono, ciudad por idioma, enlaces y nombre del fichero de foto. |
| `LANGUAGES` | Idiomas y nivel, por idioma del CV. |
| `EXPERIENCE` | Puestos, de más reciente a más antiguo. |
| `PROJECTS` | Proyectos destacados (aparecen en todos los perfiles). |
| `WRITING` | Publicaciones o blog (opcional). |
| `EDUCATION` | Formación. |
| `CERTS` | Certificaciones. |
| `VARIANTS` | Los perfiles: qué título, resumen, skills y secciones tiene cada uno. |

### Perfiles (`VARIANTS`)

Cada clave genera **un par de CVs** (en + es). Propiedades:

- `file`: etiqueta del perfil; se usa en el nombre del fichero y en los filtros `variants`.
- `title`: puesto que aparece bajo tu nombre.
- `summary`: párrafo de apertura. Puede usar `${CONTACT.city[lang]}`.
- `skills`: pares `[etiqueta, lista]`.
- `order`: secciones y su orden. Valores válidos: `summary`, `skills`, `experience`, `projects`, `writing`, `education`, `certs`, `languages`.
- `maxBullets` *(opcional)*: recorta cada puesto a N bullets para que el CV quepa en 2 páginas.

Para añadir un perfil nuevo (Frontend, Backend_Java…) duplica un bloque de `VARIANTS` y cambia sus valores.

### Filtrar contenido por perfil

`EXPERIENCE` y `CERTS` aceptan un campo opcional `variants`:

```js
{
  org: 'Trabajo no técnico',
  // …
  variants: ['General'],   // solo aparece en el perfil "General"
}
```

Si se omite, la entrada aparece en todos los perfiles. Así un CV técnico puede dejar fuera un empleo que no aporta y otro más generalista incluirlo.

---

## Detalles de diseño que merece la pena conocer

- **Una sola hoja de estilo, pensada para imprimir**: tipografía Arial, A4 y márgenes fijados con `@page`.
- **El español ocupa ~15 % más que el inglés**: la regla `html[lang="es"]` reduce un poco la fuente para evitar que el CV se desborde a una 3.ª página.
- **Pensado para ATS**: la clase `.nb` (`white-space: nowrap`) impide que rutas de API, teléfonos o URLs se partan a final de línea, porque los sistemas de seguimiento de candidatos dejan de reconocerlos si se parten. Además, `hyphens: none`.
- **Enlaces de contacto**: se reparten de 3 en 3 por línea, respetando el orden definido en `CONTACT.links`.
- **Foto opcional**: se muestra solo si existe el fichero indicado en `CONTACT.photoFile` (por defecto `foto.png`) junto al script. Si no existe, el CV se genera sin foto.
- **Secciones opcionales**: si no quieres una sección (por ejemplo `writing`), simplemente no la incluyas en el `order` del perfil.

---

## Puesta en marcha rápida

1. Copia `build.mjs` y `data.mjs` en una carpeta (y, si quieres foto, `foto.png`).
2. Edita `data.mjs`: sustituye los valores de ejemplo por los tuyos y borra el aviso inicial.
3. Ejecuta `node build.mjs`.
4. Abre los `.html` generados e imprime a PDF.

La consola muestra cada fichero generado con su tamaño:

```
OK  Your_Name_General_EN.html  (9.8 KB)
…
4 CVs generados en /ruta/a/la/carpeta
```

---

## Limitaciones y notas

- Los idiomas están fijados a `en` y `es` en el bucle de `build.mjs`. Para añadir otro hay que ampliar ese array y el objeto de etiquetas `L` dentro de `render`.
- La salida es HTML; la conversión a PDF la hace el navegador.
- `WRITING.domain` se muestra junto a cada publicación; si usas la sección `writing`, rellénalo.