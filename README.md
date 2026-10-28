# CV Generator (build.mjs + data.mjs)

A **zero-dependency** resume generator: write your data once, and get a print-ready HTML resume (A4, exportable to PDF) for every **profile** and every **language** (English and Spanish).

```bash
node build.mjs
```

No `npm install`, no bundlers, no external templates. Just Node.js (with ES module support) and a browser to export to PDF.

_Also available in Spanish: [README.es.md](README.es.md)._

---

## What each file does

| File        | Role                                                                                                    | Edit it?                                    |
| ----------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `data.mjs`  | **The content**: contact info, experience, projects, education, certifications, languages and profiles. | Yes, it is the only file you need to touch. |
| `build.mjs` | **The engine**: reads `data.mjs`, applies the print CSS and writes the HTML files.                      | No (unless you want to change the design).  |

The point is to separate **content** from **layout**. You can share `build.mjs` as is and swap `data.mjs` for the example template, without exposing any personal data.

---

## How it works

1. `build.mjs` imports the constants exported by `data.mjs` (`SLUG`, `CONTACT`, `EXPERIENCE`, `PROJECTS`, `WRITING`, `EDUCATION`, `CERTS`, `LANGUAGES`, `VARIANTS`).
2. It loops over every entry in `VARIANTS` and, for each one, over the `en` and `es` languages.
3. The `render(doc, lang)` function builds the full HTML: a header with name, title, contact details and photo, followed by the sections in the order defined by the profile.
4. It writes one file per combination, named:

```
<SLUG>_<Profile>_<LANG>.html
```

With the example template, 4 files are generated:

```
Your_Name_General_EN.html
Your_Name_General_ES.html
Your_Name_Specialist_EN.html
Your_Name_Specialist_ES.html
```

5. Open the HTML in your browser and use **Print → Save as PDF**. The CSS (`@page`, A4, margins) already prepares the document for printing.

---

## Structure of `data.mjs`

All translatable content has the shape `{ en: '…', es: '…' }`. Basic HTML (`<b>`, `<a>`, `&mdash;`) is allowed in bullets, `summary`, `note` and `tech`. Names and organisations are escaped.

| Constant     | Contents                                                          |
| ------------ | ----------------------------------------------------------------- |
| `SLUG`       | Prefix for the output files. Letters, numbers, `-` and `_` only.  |
| `CONTACT`    | Name, email, phone, city per language, links and photo file name. |
| `LANGUAGES`  | Languages and level, in the language of each resume.              |
| `EXPERIENCE` | Jobs, most recent first.                                          |
| `PROJECTS`   | Selected projects (shown in every profile).                       |
| `WRITING`    | Blog posts or publications (optional).                            |
| `EDUCATION`  | Education.                                                        |
| `CERTS`      | Certifications.                                                   |
| `VARIANTS`   | The profiles: title, summary, skills and sections of each one.    |

### Profiles (`VARIANTS`)

Each key generates **a pair of resumes** (en + es). Properties:

- `file`: profile label; used in the output file name and in the `variants` filters.
- `title`: the job title shown under your name.
- `summary`: opening paragraph. It can use `${CONTACT.city[lang]}`.
- `skills`: `[label, list]` pairs.
- `order`: sections and their order. Valid values: `summary`, `skills`, `experience`, `projects`, `writing`, `education`, `certs`, `languages`.
- `maxBullets` _(optional)_: trims each job to N bullets so the resume fits on 2 pages.

To add a new profile (Frontend, Backend_Java…), duplicate a block in `VARIANTS` and change its values.

### Filtering content by profile

`EXPERIENCE` and `CERTS` accept an optional `variants` field:

```js
{
  org: 'Non-tech Job',
  // …
  variants: ['General'],   // only appears in the "General" profile
}
```

If omitted, the entry appears in every profile. This way a technical resume can leave out a job that adds little, while a more general one includes it.

---

## Design details worth knowing

- **A single print-oriented stylesheet**: Arial, A4, margins set with `@page`.
- **Spanish takes ~15% more space than English**: the `html[lang="es"]` rule slightly reduces the font size so the resume doesn't spill onto a third page.
- **ATS-friendly**: the `.nb` class (`white-space: nowrap`) stops API paths, phone numbers and URLs from breaking at the end of a line, since applicant tracking systems often fail to recognise them when split. `hyphens: none` is also set.
- **Contact links**: laid out three per line, keeping the order defined in `CONTACT.links`.
- **Optional photo**: shown only if the file named in `CONTACT.photoFile` (default `foto.png`) exists next to the script. Otherwise the resume is generated without a photo.
- **Optional sections**: if you don't want a section (for example `writing`), just leave it out of the profile's `order`.

---

## Quick start

1. Copy `build.mjs` and `data.mjs` into a folder (and `foto.png` if you want a photo).
2. Edit `data.mjs`: replace the example values with your own and delete the notice at the top.
3. Run `node build.mjs`.
4. Open the generated `.html` files and print them to PDF.

The console lists every generated file with its size:

```
OK  Your_Name_General_EN.html  (9.8 KB)
…
4 CVs generate on /path/to/folder
```

---

## Limitations and notes

- Languages are hard-coded to `en` and `es` in the loop of `build.mjs`. To add another one, extend that array and the `L` labels object inside `render`.
- The output is HTML; PDF conversion is done by the browser.
- `WRITING.domain` is displayed next to each publication; if you use the `writing` section, fill it in.
