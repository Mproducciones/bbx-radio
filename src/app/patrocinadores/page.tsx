import { SponsorsGrid } from '@/components/sponsor/SponsorsGrid'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Patrocinadores — Radio Bienvenida',
  description: 'Marcas que apoyan y anuncian en Radio Bienvenida 93.3 FM y su app.',
}

export default function PatrocinadoresPage() {
  return (
    <AppMenuScreen scroll className="md:max-w-4xl">
      <div className="py-4 md:py-8">
        <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Publicidad</p>
        <h1 className="font-display text-3xl md:text-4xl text-white leading-none mb-2">Patrocinadores</h1>
        <p className="text-white/45 text-sm mb-6 max-w-lg">
          Comercios y marcas con campaña activa en la app y en la radio. ¿Quieres aparecer aquí?
        </p>
        <SponsorsGrid />
        <div className="mt-6 text-center">
          <Link
            href="/anunciate"
            className="inline-flex min-h-[44px] items-center px-6 py-3 rounded-xl text-sm font-bold text-[#07070e]"
            style={{ background: 'linear-gradient(135deg, #db8918, #e8a840)' }}
          >
            Ver planes de publicidad
          </Link>
        </div>
      </div>
    </AppMenuScreen>
  )
}
