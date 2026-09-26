# NOIR — Cuisine Française Contemporaine · Paris

NOIR is an editorial, architectural web experience for an intimate contemporary French gastronomic restaurant in Paris.

Taking structural inspiration from the editorial scaffold and restrained rhythm of contemporary studio design, NOIR translates haute gastronomy into pure matter, shadow, and typographical hierarchy.

---

## 1. Restaurant Concept

- **Identity**: Contemporary French Gastronomy
- **Location**: 12 Rue de l’Ombre, 75001 Paris (Palais-Royal)
- **Tables**: 12 tables (28 seats max), single sitting per evening
- **Culinary Direction**: Chef Éléonore Vasseur
- **Philosophy**: *La recherche de l’essentiel* — Radical reduction to essentials. Zero decorative distractions, focus on thermal tension, high-heat Kishu binchotan embers, clarified broths, and biodynamic terroirs.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router 7 (`/`, `/menu`, `/about`, `/reservation`)
- **Animations**: GSAP (GreenSock) & custom scroll triggers
- **Smooth Scroll**: Lenis
- **Icons**: Lucide React (used strictly where functional)
- **Styling**: Modern CSS with CSS Modules & CSS Custom Properties / Design Tokens (No Tailwind CSS, no prebuilt component kits)

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **Architecture**: Decoupled service structure with clean separation of schemas, endpoints, and business logic.

---

## 3. Project Architecture

```text
/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   └── reservations.py   # POST /api/reservations & GET /api/health
│   │   │   └── router.py             # FastAPI API router
│   │   ├── core/
│   │   │   └── config.py             # Settings & CORS configuration
│   │   ├── schemas/
│   │   │   └── reservation.py        # Pydantic models for reservation requests
│   │   ├── services/
│   │   │   └── reservation_service.py # Business logic & reservation processor
│   │   └── main.py                   # FastAPI application entrypoint
│   ├── requirements.txt
│   └── README.md
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Minimal, scroll-reactive, mobile drawer
│   │   │   ├── Footer.tsx            # Comprehensive editorial closing
│   │   │   └── PageWrapper.tsx       # Route transitions & scroll restoration
│   │   └── ui/
│   │       ├── ImageReveal.tsx       # Signature reveal interaction
│   │       ├── ScrollIndicator.tsx   # Restrained animated continuation cue
│   │       └── SectionHeader.tsx     # Editorial typography headers
│   ├── data/
│   │   ├── restaurant.ts             # Metadata, schedules, coordinates, principles
│   │   ├── menu.ts                   # Tasting menus & à la carte dishes
│   │   ├── chapters.ts               # Five storytelling chapters
│   │   ├── chef.ts                   # Chef profile, philosophy, accolades
│   │   └── gallery.ts                # Curated culinary & architectural imagery
│   ├── pages/
│   │   ├── Home/                     # 12-stage editorial journey
│   │   ├── Menu/                     # Sticky category navigation & tasting menus
│   │   ├── About/                    # 5 distinct narrative chapters
│   │   └── Reservation/              # Full reservation form with validation & states
│   ├── services/
│   │   └── api.ts                    # Dedicated API service layer
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Main application shell & Lenis setup
│   ├── main.tsx                      # React root entry
│   └── index.css                     # Global design tokens, resets & typography
│
├── index.html                        # SEO meta, Schema.org JSON-LD, Google Fonts
├── metadata.json                     # AI Studio application metadata
└── vite.config.ts                    # Vite config with dev API mock middleware
```

---

## 4. Design System & Tokens

NOIR uses a centralized modern CSS token foundation:

- **Primary Canvas**: `--color-noir: #0C0C0E` (charcoal / near-black)
- **Deep Void**: `--color-noir-deep: #060607`
- **Surface**: `--color-noir-surface: #141417`
- **Primary Text**: `--color-ivory: #F7F5F0` (warm ivory / off-white)
- **Secondary Text**: `--color-ivory-dim: #D9D5CB`
- **Muted**: `--color-muted: #8E8A82`
- **Restrained Accent**: `--color-accent: #581C26` (dark wine / burgundy / oxidized red)
- **Display Typography**: `Italiana`, `Cormorant Garamond` (expressive Parisian editorial serif)
- **Functional Typography**: `Plus Jakarta Sans` (refined letter-spaced grotesk)

---

## 5. Interaction & Animation Strategy

- **Lenis Smooth Scroll**: Provides an analog, cinematic inertial scroll feel.
- **Signature Reveal Interaction**: Custom `ImageReveal` components expand smoothly as the user scrolls into view, gradually uncovering the restaurant's spatial depth.
- **Rhythmic Storytelling**: The homepage unfolds through distinct sections without monotonous repeating card patterns.
- **Restrained Motion**: Subtle opacity shifts, transform transitions, and respect for `prefers-reduced-motion`.

---

## 6. Reservation System & Backend Contract

The reservation system is connected through `src/services/api.ts`:

- **Endpoint**: `POST /api/reservations`
- **Payload Schema**:
  ```json
  {
    "name": "Jean de La Fontaine",
    "email": "jean@exemple.fr",
    "phone": "+33 6 12 34 56 78",
    "guests": 2,
    "date": "2026-09-25",
    "time": "20:00",
    "message": "Végétarien pour un convive."
  }
  ```
- **Validation**:
  - Name length >= 2
  - Email regex verification
  - Phone digit extraction (min 8 digits)
  - Guest count (1–12)
  - Date availability (Tuesday through Saturday, closed Sunday & Monday)
  - Time slot selection (19:00, 19:30, 20:00, 20:30, 21:00, 21:30)
- **Fallback**: If the FastAPI backend is running on a different port or offline, the client service layer handles the error gracefully and outputs a confirmed offline receipt voucher.

---

## 7. Multi-Restaurant Scalability Model

The project architecture separates data (`/src/data/`) from components and presentation:
```text
Restaurant
    ↓
Content & Metadata
    ↓
Menu & Terroir
    ↓
Visual Tokens
    ↓
Components
```
To onboard additional restaurants in the future:
1. Define a new restaurant configuration bundle implementing the interfaces in `src/types/index.ts`.
2. Swap or scope CSS variables (`--color-accent`, `--color-noir`, `--font-display`) via root data attributes.
3. The components adapt immediately without code modifications.

---

## 8. Running the Application

### Frontend
```bash
npm install
npm run dev
```
The frontend dev server will launch at `http://localhost:3000`.

### Backend (Python FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be accessible at:
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

---

## 9. Accessibility & SEO

- Semantic HTML structure (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<address>`)
- Heading hierarchy (H1 -> H2 -> H3)
- Keyboard-accessible interactive elements and visible `:focus-visible` rings
- Schema.org JSON-LD `Restaurant` structured data in `index.html`
- Full `prefers-reduced-motion` compliance
