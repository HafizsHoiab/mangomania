import { useToast } from '../../hooks/useToast.js'

const styles = {
  success: { icon: '✅', bg: 'bg-green-600', text: 'text-white' },
  error:   { icon: '❌', bg: 'bg-red-600',   text: 'text-white' },
  info:    { icon: 'ℹ️', bg: 'bg-blue-600',  text: 'text-white' },
  warning: { icon: '⚠️', bg: 'bg-amber-500', text: 'text-white' },
}

export default function Toast() {
  const { toasts, removeToast } = useToast()
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => {
        const s = styles[t.type] || styles.info
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl animate-fade-in ${s.bg} ${s.text}`}
          >
            <span className="text-base shrink-0">{s.icon}</span>
            <p className="flex-1 text-sm font-semibold leading-snug">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 ml-1 text-white shrink-0">✕</button>
          </div>
        )
      })}
    </div>
  )
}
