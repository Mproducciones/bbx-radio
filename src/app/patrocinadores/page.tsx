import { SponsorsGrid } from '@/components/sponsor/SponsorsGrid'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { getSponsors } from '@/lib/sponsorsData'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Patrocinadores — Radio Bienvenida',
  description: 'Marcas que apoyan y anuncian en Radio Bienvenida 93.3 FM y su app.',
}

export default async function PatrocinadoresPage() {
  const sponsors = await getSponsors()

  return (
    <AppMenuScreen scroll className="patrocinadores-route md:max-w-4xl">
      <div className="patrocinadores-hero rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-5 md:py-8 mb-4">
        <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Publicidad</p>
        <h1 className="font-display text-3xl md:text-4xl text-white leading-none mb-2">Patrocinadores</h1>
        <p className="text-white/45 text-sm max-w-lg">
          Marcas que suenan en la 93.3 y en la app. ¿Quieres que tu negocio aparezca aquí?
        </p>
      </div>
      <SponsorsGrid initialSponsors={sponsors} />
      <div className="mt-6 text-center pb-2">
        <Link
          href="/anunciate"
          className="inline-flex min-h-[44px] items-center px-6 py-3 rounded-xl text-sm font-bold text-[#07070e]"
          style={{ background: 'linear-gradient(135deg, #db8918, #e8a840)' }}
        >
          Ver planes de publicidad
        </Link>
      </div>
    </AppMenuScreen>
  )
}
