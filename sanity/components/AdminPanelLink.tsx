/** Primer ítem del editor Sanity — devuelve al panel operativo de la radio. */
export function AdminPanelLink() {
  return (
    <div
      style={{
        padding: '1.75rem 1.5rem',
        maxWidth: 420,
        fontFamily: 'system-ui, sans-serif',
        color: '#e8e8f0',
        lineHeight: 1.5,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#db8918',
          marginBottom: 8,
        }}
      >
        Panel de la radio
      </p>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>
        Esto no es el panel principal
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 16px' }}>
        Para <strong style={{ color: '#fff' }}>publicidad, clientes, sorteos y en vivo</strong> usá el panel
        integrado (misma app que escuchan los oyentes).
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>
        Este editor sirve para cargar <strong style={{ color: 'rgba(255,255,255,0.7)' }}>noticias, grilla, banners
        y textos</strong> que después se ven en la app.
      </p>
      <a
        href="/admin"
        style={{
          display: 'inline-block',
          padding: '10px 18px',
          borderRadius: 10,
          background: 'linear-gradient(135deg, #db8918, #e8a840)',
          color: '#07070e',
          fontWeight: 800,
          fontSize: 13,
          textDecoration: 'none',
        }}
      >
        Ir al panel radio →
      </a>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 20 }}>
        Atajo: <a href="/admin" style={{ color: '#40B9BF' }}>/admin</a> · Comercial · En vivo
      </p>
    </div>
  )
}
