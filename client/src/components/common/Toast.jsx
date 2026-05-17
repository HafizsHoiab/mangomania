import { useToast } from '../../hooks/useToast.js'

const styles = {
  success: { icon: '✅', bg: '#16a34a' },
  error:   { icon: '❌', bg: '#dc2626' },
  info:    { icon: 'ℹ️', bg: '#2563eb' },
  warning: { icon: '⚠️', bg: '#d97706' },
}

export default function Toast() {
  const { toasts, removeToast } = useToast()
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px', width: '100%' }}>
      {toasts.map((t) => {
        const s = styles[t.type] || styles.info
        return (
          <div
            key={t.id}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: s.bg, color: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{s.icon}</span>
            <p style={{ flex: 1, fontSize: '14px', fontWeight: 600, margin: 0, color: '#ffffff' }}>{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '16px', opacity: 0.8, flexShrink: 0 }}
            >✕</button>
          </div>
        )
      })}
    </div>
  )
}
