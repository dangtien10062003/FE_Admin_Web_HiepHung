function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
