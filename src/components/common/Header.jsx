import { useState } from 'react'
import { ChevronDown, LogOut, Menu, RefreshCw, UserCircle } from 'lucide-react'
import { LOGIN_URL } from '../../config/urls'

function Header({ onMenuClick }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  function logout() {
    localStorage.removeItem('myhiep_admin')
    window.location.href = LOGIN_URL
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-gray-200 bg-white shadow-sm lg:left-56">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">Quản trị Giặt Sấy Hiệp</p>
          <p className="text-xs text-gray-500">Theo dõi vận hành, dịch vụ, bảng giá và thông tin cửa hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Tải lại
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              <UserCircle size={18} />
              Admin
              <ChevronDown size={14} className={`transition ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
