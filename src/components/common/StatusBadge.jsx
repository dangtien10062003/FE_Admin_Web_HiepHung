const toneMap = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
  PickedUp: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Washing: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
}

function StatusBadge({ status, children }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneMap[status] || 'bg-slate-50 text-slate-700 ring-slate-200'}`}>
      {children || status}
    </span>
  )
}

export default StatusBadge
