# AI Report Generator

A Next.js application that uses **Claude AI (Anthropic)** to generate consistent,
branded company reports and export them as **PDF** or **Word (.docx)** documents.
All reports share the same colour palette, typography, layout, company logo area,
name, address, and timestamp — guaranteeing uniformity across every document the
company produces.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Database | Convex (serverless, real-time) |
| PDF output | PDFKit |
| DOCX output | docx |
| Styling | Tailwind CSS |

---

## Project Structure

```
ai-report-generator/
├── app/
│   ├── layout.tsx              # Root layout — wraps app with Convex provider
│   ├── page.tsx                # Main page (form + preview + sidebar)
│   ├── globals.css
│   └── api/
│       ├── generate/route.ts   # POST — calls Claude, returns report text
│       └── download/route.ts   # POST — returns PDF or DOCX binary
├── components/
│   ├── ConvexClientProvider.tsx
│   ├── ReportForm.tsx          # Input form
│   ├── ReportList.tsx          # Sidebar list of saved reports
│   └── ReportPreview.tsx       # In-browser preview of the report
├── convex/
│   ├── schema.ts               # Database schema
│   └── reports.ts              # CRUD mutations & queries
├── lib/
│   ├── config.ts               # ★ Company branding — edit this first
│   ├── anthropic.ts            # Claude API wrapper
│   ├── generateDocx.ts         # Branded DOCX builder
│   └── generatePdf.ts          # Branded PDF builder
├── .env.local.example
├── package.json
└── README.md
```

---

## Step-by-Step Setup

### Step 1 — Clone / push to GitHub

If you received this as a zip:

```bash
# Unzip and enter the project
cd ai-report-generator

# Initialise git and push to your GitHub
git init
git add .
git commit -m "Initial commit — AI Report Generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-report-generator.git
git push -u origin main
```

---

### Step 2 — Install dependencies

```bash
npm install
```

---

### Step 3 — Set up Convex (database)

Convex is a free serverless database. You need a free account.

```bash
# 1. Create a free account at https://convex.dev
# 2. Run the Convex setup wizard — this creates your project and writes
#    NEXT_PUBLIC_CONVEX_URL into .env.local automatically:
npx convex dev
```

> Keep this terminal running during development — it syncs your schema and
> functions to the cloud in real time.

---

### Step 4 — Set up Anthropic API

1. Go to <https://console.anthropic.com>
2. Create an API key
3. Copy it for the next step

---

### Step 5 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in every value:

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx

# Convex (already written by `npx convex dev`)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Company branding (shown on every report)
COMPANY_NAME=Your Company Name
COMPANY_ADDRESS=Your Full Address Here
COMPANY_EMAIL=contact@yourcompany.com
COMPANY_PHONE=+1 234 567 8900
COMPANY_WEBSITE=www.yourcompany.com
```

---

### Step 6 — Customise branding (optional but recommended)

Open `lib/config.ts`. This is the **single source of truth** for all branding
used by both the PDF and DOCX generators. Change the default values to match
your company before running the app.

```ts
export const companyConfig = {
  name:    "Your Company",
  address: "Your Address",
  // … colours, etc.
  colors: {
    primary: "1e40af",  // change to your brand blue
    accent:  "f59e0b",  // change to your brand accent
    // …
  },
};
```

---

### Step 7 — Run in development

Open **two terminals**:

**Terminal 1 — Convex dev server** (keeps schema in sync)
```bash
npx convex dev
```

**Terminal 2 — Next.js dev server**
```bash
npm run dev
```

Open <http://localhost:3000>

---

## How It Works

```
User fills form
      │
      ▼
POST /api/generate
      │  ← Claude generates structured Markdown report
      ▼
Content saved to Convex
      │
      ▼
ReportPreview renders in browser
      │
      ▼
POST /api/download (on button click)
      │  ← generatePdf() or generateDocx() builds branded file
      ▼
Browser downloads PDF / DOCX
```

---

## Adding a Logo

To add a real company logo to the PDF:

1. Place `logo.png` in the `/public` folder
2. In `lib/generatePdf.ts`, add after the company name:

```ts
import path from "path";
const logoPath = path.join(process.cwd(), "public", "logo.png");
doc.image(logoPath, { width: 80, align: "center" });
doc.moveDown(0.5);
```

For the DOCX, use the `ImageRun` class from `docx`:

```ts
import { ImageRun } from "docx";
import fs from "fs";

const logoBuffer = fs.readFileSync("public/logo.png");
new Paragraph({
  children: [new ImageRun({ data: logoBuffer, transformation: { width: 80, height: 40 } })],
  alignment: AlignmentType.CENTER,
})
```

---

## Production Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add all environment variables from `.env.local` in the Vercel dashboard under
**Settings → Environment Variables**.

Then run:
```bash
npx convex deploy
```

This deploys your Convex functions to production.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npx convex dev` | Start Convex sync (run alongside dev) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npx convex deploy` | Deploy Convex to production |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL is not set` | Run `npx convex dev` first |
| `Missing Anthropic API key` | Check `ANTHROPIC_API_KEY` in `.env.local` |
| PDF fonts look wrong | PDFKit uses built-in Helvetica by default — this is expected |
| DOCX missing styles | Ensure `docx` version ≥ 8.5.0 |
| Convex types missing | Run `npx convex dev` to regenerate `convex/_generated/` |

---

## License

MIT — free to use and modify for commercial projects.
