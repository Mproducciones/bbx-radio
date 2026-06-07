import { redirect } from 'next/navigation'

/** Ruta retirada del menú — redirige a Anunciate. */
export default function PatrocinadoresPage() {
  redirect('/anunciate')
}
