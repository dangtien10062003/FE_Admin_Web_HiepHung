import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/common/Header'
import SideBar from '../components/common/SideBar'

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200">
      <div
        className={`fixed left-0 top-0 z-50 h-full w-56 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <SideBar />
      </div>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:ml-56">
        <Header onMenuClick={() => setSidebarOpen((value) => !value)} />
        <main className="mt-16 flex-1 bg-gray-50 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="min-h-[calc(100vh-8rem)] rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
