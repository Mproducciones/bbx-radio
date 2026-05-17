'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { isSanityConfigured } from '@/lib/sanity'
import { useEffect, useState } from 'react'

export default function StudioPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Second barrier (works even if someone bypasses middleware).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      // We validate using a lightweight endpoint on the server through cookie.
      // If unauthorized, render nothing (route is effectively protected).
      try {
        const res = await fetch('/api/admin/me', { credentials: 'include' })
        const data = (await res.json().catch(() => null)) as { authorized?: boolean } | null
        if (!cancelled) setIsAuthorized(Boolean(data?.authorized))
      } catch {
        if (!cancelled) setIsAuthorized(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!isAuthorized) {
    // Avoid revealing that studio exists; keep UI minimal.
    return null
  }

  if (!isSanityConfigured()) {
    return <SanitySetupGuide />
  }

  return <NextStudio config={config} />
}

function SanitySetupGuide() {
  return (
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#db8918] flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-none">Panel de Administración</h1>
              <p className="text-[#666] text-sm">Powered by Sanity.io</p>
            </div>
          </div>
          <div className="h-px bg-[#222]" />
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg px-4 py-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FF9500] flex-shrink-0" />
          <p className="text-[#FF9500] text-sm font-medium">Sanity no está configurado aún</p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <Step
            number={1}
            title="Crea tu cuenta gratuita"
            description="Ve a sanity.io y regístrate. El plan gratuito incluye hasta 3 usuarios y 10 GB — más que suficiente."
            link="https://www.sanity.io/get-started"
            linkLabel="Ir a sanity.io →"
          />
          <Step
            number={2}
            title="Crea un nuevo proyecto"
            description='Elige "Create new project", ponle nombre "Radio Bienvenida" y selecciona dataset "production".'
          />
          <Step
            number={3}
            title="Copia tu Project ID"
            description='En el dashboard de Sanity, en "Project Info", verás un ID como: "a1b2c3d4". Cópialo.'
          />
          <Step
            number={4}
            title="Actualiza el archivo .env.local"
            description="Abre el archivo .env.local en la raíz del proyecto y reemplaza el valor:"
            code={`NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id-aqui\nNEXT_PUBLIC_SANITY_DATASET=production`}
          />
          <Step
            number={5}
            title="Reinicia el servidor"
            description="Detén el servidor (Ctrl+C) y vuelve a ejecutarlo. El panel aparecerá automáticamente aquí."
          />
        </div>

        {/* Contact */}
        <div className="bg-[#1A1A22] rounded-xl p-4 text-center">
          <p className="text-[#888] text-sm">
            ¿Necesitas ayuda?{' '}
            <a
              href="https://wa.me/56990776060"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#db8918] hover:underline"
            >
              Contáctanos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
  link,
  linkLabel,
  code,
}: {
  number: number
  title: string
  description: string
  link?: string
  linkLabel?: string
  code?: string
}) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 rounded-full bg-[#db8918]/20 border border-[#db8918]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[#db8918] text-xs font-bold">{number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm mb-1">{title}</p>
        <p className="text-[#888] text-sm leading-relaxed">{description}</p>
        {code && (
          <pre className="mt-2 bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#40B9BF] overflow-x-auto whitespace-pre-wrap break-all">
            {code}
          </pre>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-[#db8918] text-sm font-medium hover:underline"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  )
}
