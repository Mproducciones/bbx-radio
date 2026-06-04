'use client'

import { useState, useEffect } from 'react'
import { AdminCard, AdminCardHeader, AdminIcons, AdminSpinner } from './adminUi'

type Contest = {
  id: string
  slug: string
  title: string
  prize: string
  description: string | null
  sponsor_name: string | null
  deadline: string | null
  active: boolean
  created_at: string
}

export function ContestsPanel() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'list' | 'create'>('list')
  const [saving, setSaving] = useState(false)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [prize, setPrize] = useState('')
  const [description, setDescription] = useState('')
  const [sponsorName, setSponsorName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [activate, setActivate] = useState(true)

  function load() {
    fetch('/api/admin/contests', { credentials: 'include' })
      .then(r => r.ok ? r.json() : { contests: [] })
      .then(d => setContests(d.contests ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: string, active: boolean) {
    await fetch('/api/admin/contests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, active }),
    })
    load()
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          title,
          prize,
          description: description || undefined,
          sponsor_name: sponsorName || undefined,
          deadline: deadline || undefined,
          active: activate,
        }),
      })
      if (res.ok) {
        setMode('list')
        setSlug(''); setTitle(''); setPrize(''); setDescription(''); setSponsorName(''); setDeadline('')
        load()
      }
    } finally { setSaving(false) }
  }

  return (
    <AdminCard accent="#FF006E">
      <AdminCardHeader
        title="Sorteos patrocinados"
        icon={<AdminIcons.gift />}
        action={
          <button
            type="button"
            onClick={() => setMode(m => m === 'list' ? 'create' : 'list')}
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}
          >
            {mode === 'list' ? '+ Nuevo' : '← Volver'}
          </button>
        }
      />

      {mode === 'create' ? (
        <form onSubmit={create} className="admin-card-body space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del sorteo *" required
            className="w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E]" />
          <input value={prize} onChange={e => setPrize(e.target.value)} placeholder="Premio *" required
            className="w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E]" />
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug (opcional, ej. sorteo-verano)"
            className="w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E]" />
          <input value={sponsorName} onChange={e => setSponsorName(e.target.value)} placeholder="Patrocinador"
            className="w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E]" />
          <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Fecha límite (texto libre)"
            className="w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E]" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción"
            rows={2}
            className="w-full rounded-xl px-3 py-2.5 text-white text-sm bg-[#0A0A12] border border-[#1A1A2E] resize-none" />
          <label className="flex items-center gap-2 text-white/60 text-xs">
            <input type="checkbox" checked={activate} onChange={e => setActivate(e.target.checked)} />
            Activar al crear (desactiva otros)
          </label>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-[#07070E] disabled:opacity-50"
            style={{ background: '#db8918' }}>
            {saving ? 'Guardando…' : 'Crear sorteo'}
          </button>
        </form>
      ) : (
        <div className="divide-y divide-white/[0.05] max-h-80 overflow-y-auto">
          {loading ? (
            <AdminSpinner />
          ) : contests.length === 0 ? (
            <p className="py-8 text-center text-[#444468] text-xs">Sin sorteos. Crea uno para la pestaña Participa.</p>
          ) : (
            contests.map(c => (
              <div key={c.id} className="px-4 py-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.active ? 'bg-[#00D9A0]' : 'bg-[#333355]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold">{c.title}</p>
                  <p className="text-[#40B9BF] text-[10px] mt-0.5">{c.prize}</p>
                  <p className="text-[#444468] text-[10px] mt-0.5">
                    {c.sponsor_name && `${c.sponsor_name} · `}slug: {c.slug}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleActive(c.id, !c.active)}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: c.active ? 'rgba(239,68,68,0.15)' : 'rgba(0,217,160,0.15)', color: c.active ? '#f87171' : '#00D9A0' }}
                  >
                    {c.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <a
                    href={`/api/admin/contests/export?slug=${encodeURIComponent(c.slug)}`}
                    className="text-[10px] text-[#444468] hover:text-white"
                  >
                    CSV leads ↓
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminCard>
  )
}
