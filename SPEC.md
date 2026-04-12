# Zadání: Formulářová webová appka pro dentální hygienu (iPad PWA)

## Kontext projektu

Dentální hygiena potřebuje systém formulářů, které pacient vyplní na iPadu v čekárně před ošetřením. Vyplněný formulář se exportuje do PDF a automaticky uloží na Google Drive (do složky pojmenované podle pacienta). Cílem je nahradit komerční řešení xDent SafeSignatures (2000 Kč/měsíc, commit 3 roky) vlastní appkou.

## Co postavit

Webová aplikace (React + Vite), která poběží jako PWA na iPadu. Deploy na Vercel. PDF se generuje client-side. Upload na Google Drive přes Google Drive API (OAuth2 flow — hygienistka se přihlásí jednou, token se uloží).

## Technický stack

- **React + Vite + TypeScript**
- **Tailwind CSS** pro styling
- **jsPDF** pro generování PDF (nebo lepší alternativa — cíl je čisté, profesionální PDF)
- **signature_pad** knihovna pro podpis prstem na iPadu
- **Google Drive API** (googleapis / gapi) pro upload PDF do sdílené složky
- **PWA manifest + service worker** aby se dala "nainstalovat" na iPad home screen
- **Deploy: Vercel** — konfigurace musí být Vercel-compatible (správný build output, žádné server-side dependencies pokud není potřeba API route pro OAuth)

### Pozn. k Vercel

Pokud Google Drive OAuth vyžaduje server-side token exchange, použij Vercel API routes (`/api/...`). Jinak drž vše client-side. Appka musí fungovat s `vercel dev` lokálně i po deployi.

## Formuláře — architektura

### Jazykové verze

Každý typ formuláře existuje ve **dvou jazykových verzích: CZ a EN**. Jazyková verze je SAMOSTATNÝ formulář config (ne runtime přepínání) — tzn. `anamneza-cz.ts` a `anamneza-en.ts` jsou dva odlišné soubory. Důvod: texty, labely i statický wording se budou lišit (nejde o strojový překlad, dodám vlastní texty).

### Typy formulářů

| # | Typ formuláře | CZ | EN |
|---|---|---|---|
| 1 | Anamnestický dotazník | `anamneza-cz` | `anamneza-en` |
| 2 | Informovaný souhlas | `souhlas-cz` | `souhlas-en` |
| 3 | GDPR souhlas | `gdpr-cz` | `gdpr-en` |
| 4 | Souhlas s rentgenem | `rtg-cz` | `rtg-en` |

= **8 formulářů celkem** (počet se bude rozšiřovat, architektura to musí umožnit snadno).

### Prázdné šablony — ŽÁDNÉ HARDCODED TEXTY

Všechny formulářové config soubory budou **prázdné šablony (templates)** — žádné předvyplněné texty, labely, ani placeholder wording. Místo toho:

- Každý field má `label: ""` (prázdný string)
- Každý `staticText` field má `content: ""` 
- Sekce mají `title: ""`
- Formulář má `title: ""` a `description: ""`
- Zachovej správnou STRUKTURU (typy fieldů, sekce, podmíněná logika, required flags) — jen texty budou prázdné
- Ke každému fieldu přidej komentář typu `// TODO: doplnit label` aby bylo jasné co kam patří
- Každý config soubor bude mít na začátku blokový komentář vysvětlující jaký typ formuláře to je a co se od něj čeká

### Příklad struktury jednoho config souboru

```typescript
// config/forms/anamneza-cz.ts

/**
 * Anamnestický dotazník — česká verze
 * 
 * Struktura:
 * 1. Osobní údaje pacienta
 * 2. Zdravotní anamnéza (alergie, léky, onemocnění)
 * 3. Dentální anamnéza (návyky, problémy)
 * 4. Poznámky + podpis
 * 
 * TODO: Doplnit všechny texty (labels, placeholders, options, staticText)
 */

import { FormConfig } from '../formTypes';

export const anamnezaCz: FormConfig = {
  id: 'anamneza-cz',
  title: '',           // TODO: doplnit název formuláře
  description: '',     // TODO: doplnit popis
  language: 'cs',
  version: '1.0',
  sections: [
    {
      title: '',       // TODO: sekce 1 — osobní údaje
      fields: [
        { id: 'firstName', type: 'text', label: '', required: true },    // TODO: jméno
        { id: 'lastName', type: 'text', label: '', required: true },     // TODO: příjmení
        { id: 'birthDate', type: 'date', label: '', required: true },    // TODO: datum narození
        { id: 'phone', type: 'tel', label: '', required: false },        // TODO: telefon
        { id: 'email', type: 'email', label: '', required: false },      // TODO: email
      ]
    },
    // ... další sekce se stejným vzorem
  ]
};
```

### Generická architektura formulářů

Formuláře definuj jako TypeScript config. Typy:

```typescript
// config/formTypes.ts

type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'tel'
  | 'email'
  | 'date'
  | 'number'
  | 'checkbox'           // single checkbox (true/false)
  | 'checkboxGroup'      // multiple choice
  | 'radio'              // single choice
  | 'select'             // dropdown
  | 'signature'          // podpis (canvas)
  | 'staticText'         // needitovatelný text (pro souhlasy apod.)
  | 'divider';           // vizuální oddělovač

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];  // pro checkboxGroup, radio, select
  conditionalOn?: {                               // podmíněné zobrazení
    fieldId: string;
    value: any;
  };
  content?: string;        // pro staticText
  maxLength?: number;
  inputMode?: string;      // pro mobilní klávesnici
}

interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormConfig {
  id: string;
  title: string;
  description: string;
  language: 'cs' | 'en';
  version: string;
  sections: FormSection[];
}
```

## Google Drive integrace

### Flow

1. Hygienistka se při prvním spuštění přihlásí přes Google OAuth2 (popup)
2. Token se uloží (refresh token persistent, aby se nemusela přihlašovat pořád)
3. Po vygenerování PDF se soubor automaticky nahraje na Google Drive:
   - Do přednastavené root složky (ID složky v configu)
   - Podsložka pojmenovaná `{Příjmení}_{Jméno}` — pokud neexistuje, vytvoří se
   - Název souboru: `{prijmeni}_{jmeno}_{typ-formulare}_{YYYY-MM-DD}.pdf`
4. Po úspěšném uploadu zobrazit potvrzení s linkem na soubor v Drive

### Technické detaily

- Google Cloud Console: budu potřebovat OAuth2 Client ID (web application) — to si vytvořím sám, v appce jen místo pro konfiguraci (env variable `VITE_GOOGLE_CLIENT_ID` a pokud potřeba `GOOGLE_CLIENT_SECRET` pro API route)
- Scope: `https://www.googleapis.com/auth/drive.file` (přístup jen k souborům vytvořeným appkou)
- Pokud OAuth token exchange vyžaduje server secret, udělej to přes Vercel API route (`/api/auth/google`)
- Fallback: pokud Google Drive není připojený / selže upload, nabídni ruční stažení PDF (appka MUSÍ fungovat i offline / bez Drive)

### Config

```typescript
// config/clinic.ts

export const clinicConfig = {
  name: '',              // TODO: název ordinace
  address: '',           // TODO: adresa
  phone: '',             // TODO: telefon
  email: '',             // TODO: email
  logoPath: '/logo.png', // logo v /public
  googleDrive: {
    rootFolderId: '',    // TODO: ID Google Drive složky (z URL)
  }
};
```

## UX požadavky (kritické — appka je pro pacienty, ne pro IT)

- **iPad-first design**: velké touch targety (min 44px), velký font, žádné drobné prvky
- **Jednoduchý flow**: úvodní obrazovka → výběr formuláře (seskupené podle jazyka: CZ | EN) → vyplnění po sekcích (wizard/stepper, NE jeden dlouhý scroll) → review → podpis → generování PDF → upload na Drive
- **Progress bar** nahoře ukazující postup
- **Validace v reálném čase** — červený rámeček + srozumitelná chybová hláška
- **UI jazyk appky samotné (navigace, tlačítka)**: dvojjazyčný — tlačítka a UI prvky zobrazuj v jazyce zvoleného formuláře. Tzn. pokud pacient vybere EN formulář, celé UI (Next, Back, Signature) bude anglicky. Pokud CZ, bude česky (Další, Zpět, Podpis).
- **Klávesnice**: input typy správně nastavené (tel, email, text, number) aby iPad ukazoval správnou klávesnici
- **Po odeslání**: 
  1. Automaticky vygenerovat PDF
  2. Automaticky nahrát na Google Drive (pokud připojeno)
  3. Zobrazit stav: "Nahráno na Drive ✓" nebo "Stáhnout PDF" jako fallback
  4. Nabídnout "Sdílet" (Web Share API na iPadu)
  5. Tlačítko "Nový pacient" (vyčistí formulář, vrátí na výběr)

## PDF výstup

- Čisté, profesionální PDF s logem ordinace nahoře (logo v /public jako PNG)
- Hlavička: údaje z `clinicConfig` (název, adresa, kontakt)
- Název formuláře + datum + verze
- Všechny vyplněné údaje přehledně formátované
- Podpis pacienta jako obrázek vložený do PDF
- Název souboru: `{prijmeni}_{jmeno}_{typ-formulare}_{YYYY-MM-DD}.pdf`

## Design

- **Styl**: čistý, profesionální, medical/healthcare vibe — NENÍ to generic bootstrap
- Světlé pozadí, modrozelená / teal paleta (asociace s čistotou, zdravotnictvím)
- Velké, zaoblené karty a inputy
- Příjemná typografie — ne default system font
- Logo ordinace na úvodní stránce
- Animace: jemné přechody mezi sekcemi (fade/slide), nic agresivního
- Formulářový výběr: karty seskupené do dvou sloupců (CZ | EN), každá s ikonou a krátkým popisem

## Struktura projektu

```
src/
  components/
    FormWizard.tsx          # hlavní wizard/stepper
    FormField.tsx            # renderuje jednotlivé fieldy podle typu
    SignaturePad.tsx          # wrapper kolem signature_pad
    ProgressBar.tsx
    FormSelector.tsx         # úvodní výběr formuláře (CZ | EN skupiny)
    ReviewScreen.tsx         # přehled odpovědí před odesláním
    SuccessScreen.tsx        # potvrzení + link na Drive + nový pacient
    GoogleDriveStatus.tsx    # indikátor připojení Drive (v headeru)
  config/
    formTypes.ts             # TypeScript typy pro formuláře
    forms/
      anamneza-cz.ts         # prázdná šablona
      anamneza-en.ts         # prázdná šablona
      souhlas-cz.ts          # prázdná šablona
      souhlas-en.ts          # prázdná šablona
      gdpr-cz.ts             # prázdná šablona
      gdpr-en.ts             # prázdná šablona
      rtg-cz.ts              # prázdná šablona
      rtg-en.ts              # prázdná šablona
      index.ts               # re-export všech formulářů
    clinic.ts                # údaje ordinace (prázdné, TODO)
  hooks/
    useFormState.ts          # stav formuláře
    useGoogleDrive.ts        # Google Drive auth + upload
  utils/
    generatePDF.ts           # PDF generování
    validation.ts            # validační pravidla
    driveUpload.ts           # Google Drive API wrapper
  i18n/
    ui-strings.ts            # UI texty (tlačítka, navigace) pro cs + en
  App.tsx
  main.tsx
api/
  auth/
    google.ts                # Vercel API route pro OAuth token exchange (pokud potřeba)
public/
  logo.png                   # placeholder logo
  manifest.json              # PWA manifest
  sw.js                      # service worker
.env.example                  # VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_DRIVE_FOLDER_ID
vercel.json                   # Vercel config (pokud potřeba)
```

## Co NEŘEŠIT (zatím)

- Automatický upload do xDent (nemá API — PDF se do karty nahraje ručně z Drive)
- Autentizaci pacientů / login (iPad bude zamčený v ordinaci, Google login je jen pro hygienistku)
- Databázi (žádný backend state, formuláře jsou stateless)
- Texty formulářů — dodám později, teď jen prázdné šablony se správnou strukturou

## Spuštění

```bash
npm create vite@latest dental-forms -- --template react-ts
cd dental-forms
npm install
# + závislosti: tailwindcss, jspdf, signature_pad atd.
npm run dev
```

Pro Vercel deploy:
```bash
vercel
```

## Shrnutí

Výsledek: hygienistka zapne appku na iPadu → podá pacientovi → ten vybere jazyk a formulář → vyplní po sekcích → podepíše se → PDF se vygeneruje a automaticky nahraje na Google Drive do složky s jeho jménem → hygienistka vidí potvrzení → klikne "Nový pacient". Z Drive pak PDF ručně nahraje do xDent karty.

Všechny texty ve formulářích jsou PRÁZDNÉ — jen struktura, typy fieldů a logika. Texty dodám v dalším kroku.
