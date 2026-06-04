'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { AdminPageBackground } from './adminUi'

type AdminLoginScreenProps = {
  eyebrow: string
  title: string
  subtitle: string
  accentBar?: 'studio' | 'bbx'
  footer?: string
  children: ReactNode
}

export function AdminLoginScreen({
  eyebrow,
  title,
  subtitle,
  accentBar = 'studio',
  footer = 'Solo personal autorizado · Powered by BBX',
  children,
}: AdminLoginScreenProps) {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 admin-mesh">
      <AdminPageBackground />
      <section className="w-full max-w-md relative admin-section-enter">
        <div className="text-center mb-10">
          <div
            className="admin-brand-mark mx-auto mb-5"
            style={
              accentBar === 'bbx'
                ? { background: 'linear-gradient(135deg, #00D9A0, #40B9BF)' }
                : undefined
            }
          >
            <div className="admin-brand-mark__inner">
              {accentBar === 'bbx' ? (
                <div className="w-full h-full flex items-center justify-center font-display text-xl text-[#00D9A0]">
                  BBX
                </div>
              ) : (
                <Image
                  src="/icons/icon-512.png"
                  alt=""
                  width={72}
                  height={72}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
          <p className="pro-eyebrow mb-2">{eyebrow}</p>
          <h1 className="text-white font-display text-4xl leading-none tracking-wide">{title}</h1>
          <p className="text-white/50 text-base mt-3">{subtitle}</p>
        </div>
        <div className="admin-login-card">
          <div
            className="admin-login-card__bar"
            aria-hidden
            style={
              accentBar === 'bbx'
                ? { background: 'linear-gradient(90deg, #00D9A0, #40B9BF, #7D59B5)' }
                : undefined
            }
          />
          {children}
        </div>
        <p className="text-white/25 text-xs text-center mt-6 tracking-wide">{footer}</p>
      </section>
    </main>
  )
}
