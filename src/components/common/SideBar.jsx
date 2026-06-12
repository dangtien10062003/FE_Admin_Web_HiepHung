import { ExternalLink, Waves } from 'lucide-react'
import { CUSTOMER_WEB_URL } from '../../config/urls'
import Menu from './Menu'

function SideBar() {
  return (
    <aside className="flex h-full w-56 flex-col bg-gradient-to-b from-slate-200 to-slate-300 text-slate-950 shadow-xl">
      <div className="flex flex-col items-center px-3 pb-4 pt-4">
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md">
          <Waves size={22} />
        </div>
        <h2 className="text-center text-base font-semibold tracking-wide">Hiệp</h2>
        <p className="mt-1 text-center text-xs text-slate-600">Laundry Admin</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <Menu />
      </div>

      <div className="border-t border-slate-400 bg-slate-200 p-3">
        <a
          className="flex items-center justify-between rounded-md px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          href={CUSTOMER_WEB_URL}
          target="_blank"
          rel="noreferrer"
        >
          Xem web khách
          <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  )
}

export default SideBar
