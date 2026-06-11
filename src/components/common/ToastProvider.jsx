import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from '../../hooks/toastContext'
import ToastContainer from './ToastContainer'

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((toast) => {
    const id = crypto.randomUUID()
    const nextToast = {
      id,
      type: toast.type || 'info',
      title: toast.title || 'Thông báo',
      message: toast.message || '',
    }

    setToasts((items) => [...items, nextToast])
    window.setTimeout(() => removeToast(id), toast.duration || 3500)
  }, [removeToast])

  const value = useMemo(() => ({
    success: (message, title = 'Thành công') => showToast({ type: 'success', title, message }),
    error: (message, title = 'Có lỗi xảy ra') => showToast({ type: 'error', title, message, duration: 5000 }),
    info: (message, title = 'Thông báo') => showToast({ type: 'info', title, message }),
  }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export default ToastProvider
