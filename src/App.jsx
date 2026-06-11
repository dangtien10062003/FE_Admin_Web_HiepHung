import { Navigate, Route, Routes } from 'react-router-dom'
import { LOGIN_URL } from './config/urls'
import ToastProvider from './components/common/ToastProvider'
import AdminLayout from './layouts/AdminLayout'
import BookingsPage from './pages/admin/Bookings'
import DashboardPage from './pages/admin/Dashboard'
import PricesPage from './pages/admin/Prices'
import ServicesPage from './pages/admin/Services'
import StoreSettingsPage from './pages/admin/StoreSettings'

function App() {
  const authFromLogin = new URLSearchParams(window.location.search).get('auth')

  if (authFromLogin === '1') {
    localStorage.setItem('myhiep_admin', '1')
    window.history.replaceState(null, '', window.location.pathname)
  }

  if (localStorage.getItem('myhiep_admin') !== '1') {
    window.location.replace(LOGIN_URL)
    return null
  }

  return (
    <ToastProvider>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/store" element={<StoreSettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </ToastProvider>
  )
}

export default App
