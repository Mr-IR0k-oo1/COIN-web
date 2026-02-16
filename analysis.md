# CoIN-web Analysis

## Overview
This repo contains a Next.js 16 frontend and a Rust (Axum) backend. The frontend renders public pages, student portal, and admin console. The backend exposes JSON APIs backed by PostgreSQL for hackathons, submissions, blog posts, students, and exports.

## Working Model (End-to-End)
1. Browser loads Next.js routes under `app/` with shared layout and theme providers.
2. Client components use Zustand stores in `lib/store/*`.
3. Stores call the service layer in `lib/services/backend.ts`.
4. The service layer uses `lib/api.ts` to call the backend and attach `coin_token` if present.
5. The Rust API in `backend/src/main.rs` routes to handlers and uses SQLx to read/write Postgres.
6. Data is persisted using SQL migrations in `backend/migrations/*`.

## Auth Model
- Admin login returns a JWT; admin routes require the JWT via middleware.
- Student login/registration returns a JWT, but student endpoints are not currently protected by middleware.

## Data Model Summary
- Admins create hackathons and blog posts.
- Hackathons are referenced by submissions.
- Submissions have many participants and mentors.
- Blog posts can link to hackathons.
- Students have profiles and many skills.

## Runtime Flows
Public:
- `GET /api/hackathons`, `GET /api/blog` for lists.
- Detail pages use store caches and fetch by id/slug when missing.

Student:
- Register/login creates JWT stored in localStorage.
- Submission wizard collects team/participants/mentors and posts to `POST /api/submit`.

Admin:
- Admin login stores JWT and unlocks dashboard.
- CRUD for hackathons, blog posts, and submissions via `/api/admin/*` endpoints.

Export:
- Admin export endpoint returns CSV or XLSX (CSV fallback) for filtered submission data.

## Current Project Structure
```text
.
├── .env.local
├── .eslintrc.json
├── .stylelintrc.json
├── app
│   ├── about
│   │   └── page.tsx
│   ├── admin
│   │   ├── blog
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   ├── page-integrated.tsx
│   │   │   └── page.tsx
│   │   ├── guidelines
│   │   │   └── page.tsx
│   │   ├── hackathons
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   ├── page-new.tsx
│   │   │   └── page.tsx
│   │   ├── participation
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── reports
│   │       └── page.tsx
│   ├── blog
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── demo
│   │   ├── animated-grid
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── error
│   │   └── page.tsx
│   ├── globals.css
│   ├── hackathons
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── help
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── privacy
│   │   └── page.tsx
│   ├── robots.ts
│   ├── security
│   │   └── page.tsx
│   ├── showcase
│   │   └── page.tsx
│   ├── sitemap.ts
│   ├── student
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   └── register
│   │       └── page.tsx
│   ├── submit
│   │   └── page.tsx
│   ├── success
│   │   └── page.tsx
│   ├── template.tsx
│   └── terms
│       └── page.tsx
├── backend
│   ├── .env.example
│   ├── .gitignore
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── migrations
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_students_table.sql
│   ├── sqlx-data.json
│   └── src
│       ├── auth.rs
│       ├── db.rs
│       ├── error.rs
│       ├── export.rs
│       ├── handlers
│       │   ├── admin.rs
│       │   ├── metrics.rs
│       │   ├── mod.rs
│       │   ├── public.rs
│       │   └── student.rs
│       ├── main.rs
│       ├── middleware.rs
│       ├── models.rs
│       └── utils.rs
├── bun.lock
├── components
│   ├── AdminLayout.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Mission.tsx
│   ├── mode-toggle.tsx
│   ├── theme-provider.tsx
│   └── ui
│       ├── Section.tsx
│       ├── animated-grid-pattern.tsx
│       ├── badge.tsx
│       ├── bento-grid.tsx
│       ├── button.tsx
│       ├── page-hero.tsx
│       └── preloader.tsx
├── docker-compose.yml
├── lib
│   ├── api.ts
│   ├── services
│   │   └── backend.ts
│   ├── store
│   │   ├── authStore.ts
│   │   ├── blogStore.ts
│   │   ├── hackathonStore.ts
│   │   ├── studentStore.ts
│   │   └── submissionStore.ts
│   ├── types.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.js
├── output.css
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## File Logic Map

### Root and Config
| File | Logic Summary |
| --- | --- |
| `.env.local` | Local environment overrides for the frontend. |
| `.eslintrc.json` | ESLint rules for Next.js and TS. |
| `.stylelintrc.json` | Stylelint config for CSS conventions. |
| `package.json` | Frontend dependencies and scripts. |
| `package-lock.json` | NPM lockfile. |
| `bun.lock` | Bun lockfile. |
| `next.config.js` | Next.js runtime config and flags. |
| `tailwind.config.ts` | Tailwind theme tokens and animations. |
| `postcss.config.js` | PostCSS configuration for Tailwind. |
| `tsconfig.json` | TypeScript compiler config. |
| `tsconfig.tsbuildinfo` | TS incremental build cache. |
| `next-env.d.ts` | Next.js TypeScript environment types. |
| `output.css` | Generated CSS output (build artifact). |
| `docker-compose.yml` | Local infra (Postgres, optional pgAdmin/Redis). |

### Frontend App Routes (`app/`)
| File | Logic Summary |
| --- | --- |
| `app/layout.tsx` | Root layout, fonts, theme provider, and preloader. |
| `app/template.tsx` | Transition wrapper for page animations. |
| `app/globals.css` | Global CSS, theme vars, and utility classes. |
| `app/page.tsx` | Home page: hero, ecosystem, workflows, latest posts. |
| `app/about/page.tsx` | Mission, audience, workflow, CTA. |
| `app/hackathons/page.tsx` | Public hackathon list with filters. |
| `app/hackathons/[slug]/page.tsx` | Hackathon detail view via store fetch. |
| `app/blog/page.tsx` | Blog listing with category filtering. |
| `app/blog/[slug]/page.tsx` | Blog detail rendering from stored content. |
| `app/submit/page.tsx` | Multi-step participation submission wizard. |
| `app/success/page.tsx` | Success confirmation and summary. |
| `app/showcase/page.tsx` | Marketing showcase page. |
| `app/demo/page.tsx` | PageHero demo. |
| `app/demo/animated-grid/page.tsx` | Animated grid demo. |
| `app/help/page.tsx` | Help center and FAQ view. |
| `app/contact/page.tsx` | Contact info and message form UI. |
| `app/privacy/page.tsx` | Privacy policy content. |
| `app/security/page.tsx` | Security policy content. |
| `app/terms/page.tsx` | Terms of service content. |
| `app/error/page.tsx` | Error view for route-level errors. |
| `app/not-found.tsx` | 404 page. |
| `app/loading.tsx` | Loading UI. |
| `app/robots.ts` | Robots rules. |
| `app/sitemap.ts` | Sitemap generation. |
| `app/student/layout.tsx` | Student layout and auth guard. |
| `app/student/login/page.tsx` | Student login screen. |
| `app/student/register/page.tsx` | Student registration form. |
| `app/student/dashboard/page.tsx` | Student search and teammate discovery. |
| `app/student/profile/page.tsx` | Student profile editor. |
| `app/admin/login/page.tsx` | Admin login screen. |
| `app/admin/login/page-new.tsx` | Alternate admin login UI. |
| `app/admin/dashboard/page.tsx` | Admin dashboard metrics and recent submissions. |
| `app/admin/dashboard/page-integrated.tsx` | Dashboard variant using metrics endpoint. |
| `app/admin/hackathons/page.tsx` | Admin hackathon CRUD. |
| `app/admin/blog/page.tsx` | Admin blog post CRUD. |
| `app/admin/participation/page.tsx` | Submission list and filters. |
| `app/admin/participation/[id]/page.tsx` | Submission detail view. |
| `app/admin/reports/page.tsx` | CSV/XLSX export UI and stats. |
| `app/admin/guidelines/page.tsx` | Admin operating guidelines. |

### Frontend Components (`components/`)
| File | Logic Summary |
| --- | --- |
| `components/Header.tsx` | Main navigation, auth-aware CTAs, mobile menu. |
| `components/Footer.tsx` | Footer links and status block. |
| `components/AdminLayout.tsx` | Admin sidebar layout and guard. |
| `components/Mission.tsx` | Mission section content with GSAP hooks. |
| `components/mode-toggle.tsx` | Light/dark toggle. |
| `components/theme-provider.tsx` | Next Themes provider wrapper. |
| `components/ui/button.tsx` | Button with variants (CVA). |
| `components/ui/badge.tsx` | Badge component (CVA). |
| `components/ui/preloader.tsx` | Fullscreen preloader animation. |
| `components/ui/animated-grid-pattern.tsx` | Animated SVG grid background. |
| `components/ui/page-hero.tsx` | Hero block with animated background. |
| `components/ui/Section.tsx` | Section wrapper with GSAP reveal and variants. |
| `components/ui/bento-grid.tsx` | Bento grid layout and card item. |

### Frontend Library (`lib/`)
| File | Logic Summary |
| --- | --- |
| `lib/api.ts` | Fetch helper with params, headers, and auth token injection. |
| `lib/services/backend.ts` | Service layer mapping backend models to frontend types and CRUD calls. |
| `lib/utils.ts` | Shared UI utils, date formatting, CSV/Excel export helpers. |
| `lib/types.ts` | Shared frontend types. |
| `lib/store/authStore.ts` | Admin auth state and persistence. |
| `lib/store/studentStore.ts` | Student auth, profile update, search. |
| `lib/store/hackathonStore.ts` | Hackathon store and CRUD. |
| `lib/store/blogStore.ts` | Blog store and CRUD. |
| `lib/store/submissionStore.ts` | Submission store and CRUD. |

### Backend (`backend/`)
| File | Logic Summary |
| --- | --- |
| `backend/.env.example` | Backend environment template. |
| `backend/.gitignore` | Backend ignore rules. |
| `backend/Cargo.toml` | Rust dependencies and metadata. |
| `backend/Cargo.lock` | Rust lockfile. |
| `backend/migrations/001_initial_schema.sql` | Core schema for admins, hackathons, submissions, blog. |
| `backend/migrations/002_add_students_table.sql` | Students and skills schema. |
| `backend/sqlx-data.json` | SQLx query metadata. |
| `backend/src/main.rs` | App bootstrap, routes, middleware, DB pool. |
| `backend/src/auth.rs` | Password hashing and JWT create/verify. |
| `backend/src/db.rs` | Admin bootstrap creation. |
| `backend/src/error.rs` | Error type and HTTP mapping. |
| `backend/src/middleware.rs` | JWT middleware for admin routes. |
| `backend/src/utils.rs` | Email validation, slug generation, UUID validation. |
| `backend/src/export.rs` | CSV/XLSX export builder. |
| `backend/src/models.rs` | DB models, enums, and DTOs. |
| `backend/src/handlers/mod.rs` | Handler module registry and health endpoint. |
| `backend/src/handlers/public.rs` | Public endpoints: list hackathons, list blog, submit participation. |
| `backend/src/handlers/student.rs` | Student register/login/search/update profile. |
| `backend/src/handlers/admin.rs` | Admin login, CRUD, metrics, export. |
| `backend/src/handlers/metrics.rs` | Alternate metrics/export endpoints with semester filtering. |

## Best-Practice Gaps (Priority)
- Student routes are not protected by JWT middleware and allow arbitrary updates by ID.
- JWT claims do not encode a role, so any token could pass admin checks if used.
- `create_hackathon` sets `created_by` to a random UUID instead of the authenticated admin.
- `get_profile` in student handlers is unimplemented.
- Hackathon detail page uses slug in frontend, but backend expects UUID for `/api/hackathons/:id`.
- `submit_participation` has a count check that compares the list to itself and never fails.
- Frontend/backend enum mismatches for hackathon mode and status.
- Frontend `Submission` type omits `status` but UI mutates it.
- Student search SQL uses string interpolation, not parameterized queries.
- Success page expects a submission ID in query params but submit flow does not pass it.

## Recommended Fix Order
1. Add role-based JWT and enforce it for admin and student routes.
2. Fix hackathon slug vs UUID lookup mismatch.
3. Fix submission count validation and ensure request integrity checks.
4. Align frontend/backend enums for hackathon mode and status.
5. Add `status` to frontend submission type and mapping.
6. Parameterize student search query.
7. Pass submission ID to success page.
