import { useCallback, useEffect, useState } from 'react'
import { api, API_BASE_URL } from '../services/api'

export const statusLabels = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  PickedUp: 'Đã nhận đồ',
  Washing: 'Đang giặt',
  Completed: 'Hoàn tất',
  Cancelled: 'Đã hủy',
}

export const defaultStore = {
  brandName: 'Giặt Sấy Hiệp Hưng',
  address: '14/75 Nguyễn Quang Diêu, Tân Quý, Tân Phú, Tp HCM',
  hotline: '0900 000 000',
  zaloUrl: 'https://zalo.me/0900000000',
  facebookUrl: 'https://facebook.com/',
  openingHours: '7:00 - 21:00 hằng ngày',
  deliveryPolicy: 'Hỗ trợ giao nhận trong bán kính 3km',
}

const fallbackBookings = [
  { id: 1, customerName: 'Khách demo', phone: '0900000000', address: 'Khu vực gần tiệm', serviceName: 'Giặt sấy theo kg', pickupTime: new Date().toISOString(), status: 'Pending' },
  { id: 2, customerName: 'Đơn chăn ga', phone: '0911111111', address: 'Trong bán kính 3km', serviceName: 'Giặt chăn ga gối nệm', pickupTime: new Date(Date.now() + 86400000).toISOString(), status: 'Confirmed' },
]

const fallbackServices = [
  { id: 1, name: 'Giặt sấy theo kg', description: 'Phân loại màu, giặt sạch và sấy thơm.', isActive: true },
  { id: 2, name: 'Giặt hấp / giặt khô', description: 'Xử lý vest, áo khoác và đồ cần giữ form.', isActive: true },
  { id: 3, name: 'Giao nhận tận nhà', description: 'Nhận trả trong khu vực hỗ trợ.', isActive: true },
]

const fallbackPrices = [
  { id: 1, name: 'Giặt thường', priceText: '15.000đ/kg', note: 'Quần áo thường ngày' },
  { id: 2, name: 'Giặt + sấy thơm', priceText: '25.000đ/kg', note: 'Sấy khô, thơm lâu' },
  { id: 3, name: 'Giặt chăn ga', priceText: '40.000đ - 80.000đ/bộ', note: 'Tùy kích thước' },
]

export function useAdminData(status = '') {
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [prices, setPrices] = useState([])
  const [store, setStore] = useState(defaultStore)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [offlineMode, setOfflineMode] = useState(false)

  const loadAdmin = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [bookingData, serviceData, priceData, storeData] = await Promise.all([
        api.adminBookings(status),
        api.adminServices(),
        api.adminPrices(),
        api.getStoreSettings(),
      ])
      setBookings(bookingData || [])
      setServices(serviceData || [])
      setPrices(priceData || [])
      setStore({ ...defaultStore, ...storeData })
      setOfflineMode(false)
    } catch (err) {
      setBookings(fallbackBookings)
      setServices(fallbackServices)
      setPrices(fallbackPrices)
      setStore(defaultStore)
      setOfflineMode(true)
      setError(`Chưa kết nối được API ${API_BASE_URL}. Đang hiển thị dữ liệu mẫu để xem UI. ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    loadAdmin()
  }, [loadAdmin])

  return {
    bookings,
    services,
    prices,
    store,
    setStore,
    loading,
    error,
    offlineMode,
    loadAdmin,
  }
}
