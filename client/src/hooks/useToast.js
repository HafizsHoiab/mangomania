import { useState, useCallback, useEffect } from 'react'

let globalAddToast = null

export const registerToastHandler = (fn) => { globalAddToast = fn }

export const toast = {
  success: (message) => globalAddToast?.({ type: 'success', message }),
  error: (message) => globalAddToast?.({ type: 'error', message }),
  info: (message) => globalAddToast?.({ type: 'info', message }),
  warning: (message) => globalAddToast?.({ type: 'warning', message }),
}

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type, message }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  useEffect(() => {
    registerToastHandler(addToast)
    return () => { globalAddToast = null }
  }, [addToast])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return { toasts, addToast, removeToast }
}
