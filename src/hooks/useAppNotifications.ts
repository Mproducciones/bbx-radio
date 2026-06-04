'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AppNotification } from '@/lib/appNotificationsStore'
import { filterActiveNotifications } from '@/lib/notificationActive'
import {
  countUnread,
  getReadNotificationIds,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/notificationsRead'
import {
  getLocalNotifications,
  mergeNotifications,
  saveLocalNotification,
} from '@/lib/notificationsLocalCache'

export function formatNotificationWhen(iso: string) {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60_000) return 'Ahora'
    if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}

export function useAppNotifications(enabled = true) {
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [dbHint, setDbHint] = useState<string | null>(null)

  const applyList = useCallback((list: AppNotification[]) => {
    const active = filterActiveNotifications(list)
    setItems(active)
    setUnread(countUnread(active.map(n => n.id)))
  }, [])

  const refresh = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?t=${Date.now()}`, { cache: 'no-store' })
      const data = await res.json()
      const remote = (data.items ?? []) as AppNotification[]
      const local = getLocalNotifications()
      const merged = filterActiveNotifications(mergeNotifications(remote, local))
      applyList(merged)
      if (!data.dbReady) {
        setDbHint(data.hint ?? data.dbError ?? 'Falta tabla app_notifications en Supabase.')
      } else {
        setDbHint(null)
        remote.forEach(n => saveLocalNotification(n))
      }
    } catch {
      applyList(filterActiveNotifications(getLocalNotifications()))
      setDbHint('Sin conexión al servidor de avisos.')
    } finally {
      setLoading(false)
    }
  }, [enabled, applyList])

  useEffect(() => {
    if (!enabled) return
    refresh()
    const t = setInterval(refresh, 90_000)
    return () => clearInterval(t)
  }, [enabled, refresh])

  useEffect(() => {
    if (!enabled) return
    function onRefresh() { refresh() }
    window.addEventListener('bbx-notifications-refresh', onRefresh)
    function onSwMessage(e: MessageEvent) {
      if (e.data?.type === 'BBX_PUSH') onRefresh()
    }
    navigator.serviceWorker?.addEventListener('message', onSwMessage)
    return () => {
      window.removeEventListener('bbx-notifications-refresh', onRefresh)
      navigator.serviceWorker?.removeEventListener('message', onSwMessage)
    }
  }, [enabled, refresh])

  function markAllRead() {
    markAllNotificationsRead(items.map(n => n.id))
    setUnread(0)
  }

  function markRead(id: string) {
    markNotificationRead(id)
    setUnread(countUnread(items.map(i => i.id)))
  }

  function isUnread(id: string) {
    return !getReadNotificationIds().has(id)
  }

  return {
    items,
    loading,
    unread,
    dbHint,
    refresh,
    markAllRead,
    markRead,
    isUnread,
  }
}
