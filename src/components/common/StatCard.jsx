import { Link } from 'react-router-dom'

function StatCard({ label, value, hint, icon: Icon, to }) {
  const Component = to ? Link : 'div'
  const linkProps = to ? { to } : {}

  return (
    <Component {...linkProps} className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-blue-50 p-2 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
            <Icon size={20} />
          </div>
        )}
      </div>
    </Component>
  )
}

export default StatCard
