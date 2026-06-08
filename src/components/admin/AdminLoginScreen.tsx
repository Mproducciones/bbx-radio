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
    <main className={`admin-login-page admin-login-page--${accentBar} admin-mesh`}>
      <AdminPageBackground />
      <section className={`admin-login-shell admin-login-shell--${accentBar} admin-section-enter`}>
        <div className="admin-login-card">
          <div className="admin-login-card__bar" aria-hidden />
          <div className="admin-login-card__inner">
            <header className="admin-login-head">
              <div className="admin-login-brand">
                <div className="admin-login-brand__inner">
                  {accentBar === 'bbx' ? (
                    <span className="admin-login-brand__bbx">BBX</span>
                  ) : (
                    <Image
                      src="/icons/icon-512.png"
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                      priority
                    />
                  )}
                </div>
              </div>
              <p className="admin-login-eyebrow">{eyebrow}</p>
              <h1 className="admin-login-title">{title}</h1>
              <p className="admin-login-subtitle">{subtitle}</p>
            </header>
            <div className="admin-login-form">{children}</div>
          </div>
        </div>
        <p className="admin-login-footer">{footer}</p>
      </section>
    </main>
  )
}
