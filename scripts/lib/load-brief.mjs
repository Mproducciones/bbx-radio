import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

const ROOT = process.cwd()
const DEFAULT_PATH = join(ROOT, 'agents/brief.yaml')
const EXAMPLE_PATH = join(ROOT, 'agents/brief.example.yaml')

const DEFAULT_ROUTES = ['/', '/programacion', '/participa', '/saludos']
const DEFAULT_WIDTHS = [360, 390, 430]

export function loadBrief(explicitPath) {
  const path = explicitPath ?? (existsSync(DEFAULT_PATH) ? DEFAULT_PATH : EXAMPLE_PATH)
  if (!existsSync(path)) {
    throw new Error(`Brief no encontrado: ${path}`)
  }
  const raw = yaml.load(readFileSync(path, 'utf8'))
  return normalizeBrief(raw, path)
}

function normalizeBrief(raw, path) {
  const app = raw?.app ?? {}
  const brand = raw?.brand ?? {}
  return {
    path,
    app: {
      name: app.name ?? 'App',
      slug: app.slug ?? 'app',
      plan: app.plan ?? 'pro',
      locale: app.locale ?? 'es',
      site_url: app.site_url ?? 'http://localhost:3000',
    },
    brand: {
      primary: brand.primary ?? '#db8918',
      secondary: brand.secondary ?? '#40B9BF',
      tone: brand.tone ?? 'profesional',
    },
    goals: Array.isArray(raw?.goals) ? raw.goals : [],
    constraints: Array.isArray(raw?.constraints) ? raw.constraints : [],
    quality_gates: Array.isArray(raw?.quality_gates) ? raw.quality_gates : ['npm_run_build', 'overflow_viewport_360'],
    routes: Array.isArray(raw?.qa_routes) ? raw.qa_routes : DEFAULT_ROUTES,
    widths: Array.isArray(raw?.qa_widths) ? raw.qa_widths : DEFAULT_WIDTHS,
    variants_to_try: raw?.variants_to_try ?? 3,
    max_iterations: raw?.max_iterations_per_variant ?? 5,
  }
}
