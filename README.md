# ERP System Dashboard (Next.js)

Migrated from a Vite + React Router project to the Next.js App Router.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

- `src/app/` – routes (App Router). `(app)` is a route group that wraps the dashboard pages in the sidebar layout.
- `src/views/` – page-level components rendered by the routes.
- `src/components`, `src/data`, `src/hooks`, `src/types`, `src/utils` – unchanged from the original project.
