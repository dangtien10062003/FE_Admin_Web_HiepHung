import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

const styles = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    iconClassName: 'text-emerald-600',
  },
  error: {
    icon: AlertCircle,
    className: 'border-rose-200 bg-rose-50 text-rose-800',
    iconClassName: 'text-rose-600',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800',
    iconClassName: 'text-blue-600',
  },
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const style = styles[toast.type] || styles.info
        const Icon = style.icon

        return (
          <div
            key={toast.id}
            className={`rounded-lg border p-4 shadow-lg ${style.className}`}
            role="status"
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 shrink-0 ${style.iconClassName}`} size={20} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => onClose(toast.id)}
                className="rounded-md p-1 opacity-70 hover:bg-white/50 hover:opacity-100"
                aria-label="Đóng thông báo"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
