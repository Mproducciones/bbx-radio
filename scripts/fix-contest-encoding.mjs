/**
 * Corrige textos del sorteo en Supabase (encoding roto en producción).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const body = {
  title: 'Sorteo en vivo - Radio Bienvenida',
  description: 'Registrate y el locutor anuncia al ganador en la programacion.',
  prize: 'Premio sorpresa de un patrocinador',
}

const res = await fetch(`${url}/rest/v1/contests?slug=eq.sorteo-bienvenida`, {
  method: 'PATCH',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
  body: JSON.stringify(body),
})

const text = await res.text()
if (!res.ok) {
  console.error('Error', res.status, text)
  process.exit(1)
}
console.log('Sorteo actualizado:', text.slice(0, 200))
