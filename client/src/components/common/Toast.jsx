import { useToast } from '../../hooks/useToast.js'

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
}
const colors = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
}

export default function Toast() {
  const { toasts, removeToast } = useToast()
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 border-l-4 rounded-xl shadow-lg animate-fade-in ${colors[t.type]}`}
        >
          <span className="text-lg">{icons[t.type]}</span>
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600 ml-2">✕</button>
        </div>
      ))}
    </div>
  )
}
