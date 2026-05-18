'use client'

import { useEffect, useState } from 'react'

interface Package {
  nombre: string
  precio: number
  periodo: string
  caracteristicas: string[]
}

interface PackagesData {
  titulo: string
  subtitulo: string
  paqueteBasico: Package
  paquetePremium: Package
  paqueteEmpresarial: Package
  whatsapp: string
}

function WhatsAppButton({ phone }: { phone: string }) {
  const href = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-3 bg-[#128C7E] text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-[#128C7E]/30 hover:bg-[#0e7a6d] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
    >
      <svg className="w-6 h-6 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span>
        <span className="block text-sm font-medium text-white">Contáctanos por</span>
        <span className="block text-lg font-bold text-white">WhatsApp</span>
      </span>
    </a>
  )
}

export function SponsorLanding() {
  const [data, setData] = useState<PackagesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch(`/api/packages`)
        
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        // Error silencioso en producción
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--color-ink-800)] rounded w-3/4 mb-2" />
          <div className="h-4 bg-[var(--color-ink-800)] rounded w-1/2" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[var(--color-ink-800)] rounded-xl p-6 animate-pulse">
            <div className="h-5 bg-[var(--color-ink-900)] rounded w-1/3 mb-3" />
            <div className="h-8 bg-[var(--color-ink-900)] rounded w-1/4 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-4 bg-[var(--color-ink-900)] rounded w-2/3" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const hasData = !!(data?.paqueteBasico?.nombre)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="font-display text-4xl text-white leading-none">
          {hasData ? data.titulo : '¿Eres empresa?'}
        </h1>
        <p className="text-[var(--color-ink-400)] text-sm mt-3 max-w-sm mx-auto leading-relaxed">
          {hasData ? data.subtitulo : 'Anúnciate en Radio Bienvenida y llega a miles de oyentes en Rancagua'}
        </p>
      </header>

      {/* Paquetes */}
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold text-white/80 px-1">Nuestros Planes</h2>

        {/* Básico */}
        <div className="bg-[var(--color-ink-800)] rounded-xl p-5 border border-[var(--color-ink-700)] hover:border-[var(--color-ink-500)] transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-400)]">Básico</span>
              <h3 className="text-white font-bold text-lg mt-0.5">
                {hasData ? data.paqueteBasico.nombre : 'Básico'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-2xl">
                ${hasData ? data.paqueteBasico.precio.toLocaleString() : '80.000'}
              </p>
              <p className="text-[var(--color-ink-400)] text-xs">/{hasData ? data.paqueteBasico.periodo : 'mes'}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {(hasData ? data.paqueteBasico.caracteristicas : ['4 spots diarios', 'Banner en web', 'Mención en redes']).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-300)]">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-mag-400)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium - Destacado */}
        <div className="bg-gradient-to-b from-[var(--color-ink-800)] to-[var(--color-ink-800)] rounded-xl p-5 border-2 border-[var(--color-mag-400)] relative overflow-hidden">
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-[var(--color-mag-400)] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Más popular
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mag-400)]">Premium</span>
              <h3 className="text-white font-bold text-lg mt-0.5">
                {hasData ? data.paquetePremium.nombre : 'Premium'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-2xl">
                ${hasData ? data.paquetePremium.precio.toLocaleString() : '150.000'}
              </p>
              <p className="text-[var(--color-ink-400)] text-xs">/{hasData ? data.paquetePremium.periodo : 'mes'}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {(hasData ? data.paquetePremium.caracteristicas : ['8 spots diarios', 'Banner premium en web', 'Post en redes sociales', 'Promoción especial']).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-300)]">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-mag-400)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Empresarial */}
        <div className="bg-[var(--color-ink-800)] rounded-xl p-5 border border-[var(--color-pur-400)]/40 hover:border-[var(--color-pur-400)] transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-pur-400)]">Empresarial</span>
              <h3 className="text-white font-bold text-lg mt-0.5">
                {hasData ? data.paqueteEmpresarial.nombre : 'Empresarial'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-2xl">
                ${hasData ? data.paqueteEmpresarial.precio.toLocaleString() : '250.000'}
              </p>
              <p className="text-[var(--color-ink-400)] text-xs">/{hasData ? data.paqueteEmpresarial.periodo : 'mes'}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {(hasData ? data.paqueteEmpresarial.caracteristicas : ['12 spots diarios', 'Banner exclusivo', 'Campaña en redes', 'Patrocinio de programa', 'Producción de cuñas']).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-300)]">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-pur-400)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sección de Contacto Profesional */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-ink-800)] to-[var(--color-ink-900)] border border-[var(--color-ink-700)] p-6">
        {/* Efecto decorativo */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#25D366] rounded-full opacity-5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#128C7E] rounded-full opacity-5 blur-2xl" />
        
        <div className="relative flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 22h-.005c-1.828 0-3.627-.492-5.202-1.424l-.361-.214-3.741.982.998-3.648-.235-.374A9.86 9.86 0 011.946 12.06c0-5.45 4.436-9.884 9.887-9.884 2.64 0 5.122 1.03 6.987 2.898a9.825 9.825 0 012.894 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg">¿Listo para empezar?</h3>
            <p className="text-[var(--color-ink-400)] text-sm mt-1 max-w-xs">
              Conversa con nosotros y te armamos un plan a medida para tu negocio
            </p>
          </div>

          <WhatsAppButton phone={hasData ? data.whatsapp : '56950291592'} />

          <p className="text-[var(--color-ink-500)] text-xs">
            Respuesta rápida · Sin compromiso
          </p>
        </div>
      </div>
    </div>
  )
}