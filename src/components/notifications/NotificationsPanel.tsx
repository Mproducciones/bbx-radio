'use client'

import { getReadNotificationIds } from '@/lib/notificationsRead'
import { formatNotificationWhen } from '@/hooks/useAppNotifications'
import type { AppNotification } from '@/lib/appNotificationsStore'

type NotificationsPanelProps = {
  items: AppNotification[]
  loading: boolean
  unread: number
  dbHint: string | null
  onMarkAllRead: () => void
  onOpenItem: (n: AppNotification) => void
  compact?: boolean
}

export function NotificationsPanel({
  items,
  loading,
  unread,
  dbHint,
  onMarkAllRead,
  onOpenItem,
  compact,
}: NotificationsPanelProps) {
  return (
    <>
      <div className={`app-notif-panel__head ${compact ? 'app-notif-panel__head--compact' : ''}`}>
        <div>
          <p className="app-notif-panel__eyebrow">Radio Bienvenida</p>
          <h2 className="app-notif-panel__title">Avisos al aire</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {items.length > 0 && unread > 0 && (
            <button type="button" onClick={onMarkAllRead} className="app-notif-panel__mark">
              Marcar leídas
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="app-notif-panel__hint app-notif-panel__hint--inbox">
          Los avisos del locutor se guardan aquí mientras duren en cabina.
        </p>
      )}

      <div className="app-notif-panel__list">
        {loading && items.length === 0 && (
          <p className="app-notif-panel__empty">Cargando…</p>
        )}
        {dbHint && (
          <p className="app-notif-panel__empty text-[#db8918]/90">{dbHint}</p>
        )}
        {!loading && items.length === 0 && !dbHint && (
          <p className="app-notif-panel__empty">
            Sin avisos activos. Cuando el locutor envíe uno, aparecerá aquí.
          </p>
        )}
        {items.map(n => {
          const isUnread = !getReadNotificationIds().has(n.id)
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onOpenItem(n)}
              className={`app-notif-item ${isUnread ? 'is-unread' : ''}`}
            >
              {isUnread && <span className="app-notif-item__dot" aria-hidden />}
              <div className="min-w-0 flex-1 text-left">
                <p className="app-notif-item__title">{n.title}</p>
                <p className="app-notif-item__body">{n.body}</p>
                <p className="app-notif-item__meta">{formatNotificationWhen(n.created_at)}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0 opacity-40" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )
        })}
      </div>
    </>
  )
}
