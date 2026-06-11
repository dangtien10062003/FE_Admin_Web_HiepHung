import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { navigationItems } from '../../config/navigation'

function MenuItem({ item }) {
  const location = useLocation()
  const hasChildren = Boolean(item.children?.length)
  const isChildActive = useMemo(
    () => hasChildren && item.children.some((child) => child.to === location.pathname),
    [hasChildren, item.children, location.pathname],
  )
  const [expanded, setExpanded] = useState(isChildActive)
  const Icon = item.icon

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={`group flex w-full items-center justify-between rounded-lg border-l-4 px-3 py-2.5 text-left text-sm font-medium transition ${
            isChildActive
              ? 'border-blue-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
              : 'border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {Icon && <Icon size={17} className="shrink-0" />}
            <span className="truncate">{item.name}</span>
          </span>
          <ChevronRight size={16} className={`shrink-0 transition ${expanded ? 'rotate-90' : ''}`} />
        </button>
        {expanded && (
          <div className="mt-1 space-y-1 pl-4">
            {item.children.map((child) => {
              const ChildIcon = child.icon

              return (
                <NavLink
                  key={child.id}
                  to={child.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg border-l-4 px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {ChildIcon && <ChildIcon size={15} />}
                  {child.name}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `mb-1 flex items-center gap-2 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'border-blue-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
            : 'border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950'
        }`
      }
    >
      {Icon && <Icon size={17} />}
      {item.name}
    </NavLink>
  )
}

function Menu() {
  return (
    <nav className="space-y-1 px-2">
      {navigationItems.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </nav>
  )
}

export default Menu
