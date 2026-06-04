import Link from 'next/link'
import { bbxWhatsApp, BBX_CONTACT } from '@/lib/bbxContent'
import { getSubscriptionRecord } from '@/lib/subscription'
import { RADIO } from '@/lib/radioConfig'
import { SuspendedPayActions } from '@/components/billing/SuspendedPayActions'

export const metadata = {
  title: 'Servicio suspendido',
  robots: { index: false, follow: false },
}

export default async function SuspendedPage() {
  const sub = await getSubscriptionRecord()

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 py-12 text-center overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #0a0a12 0%, #07070e 100%)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(255,56,96,0.12)', border: '1px solid rgba(255,56,96,0.3)' }}>
        <span className="text-3xl" aria-hidden>⏸</span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide">
        App temporalmente fuera de servicio
      </h1>
      <p className="text-white/50 text-sm md:text-base mt-3 max-w-md leading-relaxed">
        La suscripción de <strong className="text-white/80">{RADIO.name}</strong> no está al día.
        {sub.reason ? ` ${sub.reason}` : ' Regulariza el pago para reactivar la app.'}
      </p>

      <SuspendedPayActions billingEmail={sub.billingEmail} currentPlan={sub.plan} />

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a
          href={bbxWhatsApp(`Hola ${BBX_CONTACT.name}, necesito regularizar el pago de ${RADIO.name} (BBX).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-5 rounded-xl font-bold text-sm text-[#07070e]"
          style={{ background: '#db8918' }}
        >
          WhatsApp BBX
        </a>
        <Link
          href="/admin"
          className="flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white/80"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Panel admin
        </Link>
      </div>

      <p className="text-white/25 text-xs mt-10 max-w-xs">
        Operado por BBX Radio System · {BBX_CONTACT.email}
      </p>
    </div>
  )
}
