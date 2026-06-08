import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { api, API_BASE_URL } from './services/api'

const statusLabels = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  PickedUp: 'Đã nhận đồ',
  Washing: 'Đang giặt',
  Completed: 'Hoàn tất',
  Cancelled: 'Đã hủy',
}

const defaultStore = {
  brandName: 'Giặt Sấy Hiệp Hưng',
  address: 'Địa chỉ cửa hàng đang cập nhật',
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
  { id: 1, name: 'Giặt sấy theo kg', description: 'Phân loại màu, giặt sạch và sấy thơm.' },
  { id: 2, name: 'Giặt hấp / giặt khô', description: 'Xử lý vest, áo khoác và đồ cần giữ form.' },
  { id: 3, name: 'Giao nhận tận nhà', description: 'Nhận trả trong khu vực hỗ trợ.' },
]

const fallbackPrices = [
  { id: 1, name: 'Giặt thường', priceText: '15.000đ/kg', note: 'Quần áo thường ngày' },
  { id: 2, name: 'Giặt + sấy thơm', priceText: '25.000đ/kg', note: 'Sấy khô, thơm lâu' },
  { id: 3, name: 'Giặt chăn ga', priceText: '40.000đ - 80.000đ/bộ', note: 'Tùy kích thước' },
]

function StateLine({ text }) {
  return <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-sky-50 px-3 py-2 text-sm text-slate-700">{text}</p>
}

function AdminDashboard() {
  const [tab, setTab] = useState('bookings')
  const [status, setStatus] = useState('')
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [prices, setPrices] = useState([])
  const [store, setStore] = useState(defaultStore)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [offlineMode, setOfflineMode] = useState(false)

  const loadAdmin = async () => {
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
      setError(`GitHub Pages chỉ chạy frontend tĩnh. Chưa kết nối được API ${API_BASE_URL}, đang hiển thị dữ liệu mẫu để xem UI.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAdmin() }, [status])

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="container-page">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-md border border-sky-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Sổ vận hành</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Quản trị Giặt Sấy Hiệp Hưng</h1>
            <p className="text-sm text-slate-600">Theo dõi đơn theo trạng thái, sửa dịch vụ, bảng giá và thông tin cửa hàng.</p>
            <p className="mt-3 inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              API: {offlineMode ? 'đang dùng dữ liệu mẫu' : API_BASE_URL}
            </p>
          </div>
          <div className="flex gap-2">
            <a className="btn-secondary py-2" href="https://dangtien10062003.github.io/FE_Web_HiepHung/">Web khách</a>
            <Link className="btn-primary py-2" to="/">Admin</Link>
          </div>
        </div>
        <div className="mb-5 flex flex-wrap gap-2">
          {['bookings', 'services', 'prices', 'store'].map((item) => (
            <button key={item} className={tab === item ? 'btn-primary py-2' : 'btn-secondary py-2'} onClick={() => setTab(item)}>
              {item === 'bookings' ? 'Đơn đặt lịch' : item === 'services' ? 'Dịch vụ' : item === 'prices' ? 'Bảng giá' : 'Cửa hàng'}
            </button>
          ))}
        </div>
        {loading && <StateLine text={<><LoaderCircle className="animate-spin" size={16} /> Đang tải dữ liệu...</>} />}
        {error && <StateLine text={`Không gọi được API admin: ${error}`} />}
        {tab === 'bookings' && <BookingsAdmin bookings={bookings} status={status} setStatus={setStatus} onReload={loadAdmin} />}
        {tab === 'services' && <SimpleList title="Dịch vụ" items={services} type="service" onReload={loadAdmin} />}
        {tab === 'prices' && <SimpleList title="Bảng giá" items={prices} type="price" onReload={loadAdmin} />}
        {tab === 'store' && <StoreAdmin store={store} setStore={setStore} onReload={loadAdmin} />}
      </div>
    </main>
  )
}

function BookingsAdmin({ bookings, status, setStatus, onReload }) {
  async function update(id, nextStatus) {
    try {
      await api.updateBookingStatus(id, nextStatus)
      onReload()
    } catch (error) {
      alert(`Chưa cập nhật được vì API chưa kết nối: ${error.message}`)
    }
  }
  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Danh sách đơn</h2>
        <select className="field max-w-xs" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-sky-50">
            <tr><th className="p-4">Khách</th><th className="p-4">Liên hệ</th><th className="p-4">Dịch vụ</th><th className="p-4">Giờ hẹn</th><th className="p-4">Trạng thái</th><th className="p-4">Cập nhật</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="p-4 font-semibold">{booking.customerName}<p className="font-normal text-slate-500">{booking.address}</p></td>
                <td className="p-4">{booking.phone}</td>
                <td className="p-4">{booking.serviceName || booking.service?.name}</td>
                <td className="p-4">{booking.pickupTime ? new Date(booking.pickupTime).toLocaleString('vi-VN') : ''}</td>
                <td className="p-4">{statusLabels[booking.status] || booking.status}</td>
                <td className="p-4"><select className="field" value={booking.status} onChange={(event) => update(booking.id, event.target.value)}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SimpleList({ title, items, type, onReload }) {
  const empty = type === 'price' ? { name: '', priceText: '', note: '' } : { name: '', description: '', isActive: true }
  const [draft, setDraft] = useState(empty)
  const save = async () => {
    try {
      if (type === 'price') await api.savePrice(draft)
      else await api.saveService(draft)
      setDraft(empty)
      onReload()
    } catch (error) {
      alert(`Chưa lưu được vì API chưa kết nối: ${error.message}`)
    }
  }
  const remove = async (id) => {
    try {
      if (type === 'price') await api.deletePrice(id)
      else await api.deleteService(id)
      onReload()
    } catch (error) {
      alert(`Chưa xóa được vì API chưa kết nối: ${error.message}`)
    }
  }
  return (
    <section className="card p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <input className="field" placeholder="Tên" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        <input className="field" placeholder={type === 'price' ? 'Giá' : 'Mô tả'} value={type === 'price' ? draft.priceText : draft.description} onChange={(e) => setDraft({ ...draft, [type === 'price' ? 'priceText' : 'description']: e.target.value })} />
        <button className="btn-primary" onClick={save}>Thêm mới</button>
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div className="flex flex-col justify-between gap-3 rounded-md border border-slate-100 p-4 sm:flex-row sm:items-center" key={item.id}>
            <div><p className="font-semibold">{item.name}</p><p className="text-sm text-slate-600">{item.priceText || item.description} {item.note || ''}</p></div>
            <button className="btn-secondary py-2" onClick={() => remove(item.id)}>Xóa</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function StoreAdmin({ store, setStore, onReload }) {
  const fields = ['brandName', 'address', 'hotline', 'zaloUrl', 'facebookUrl', 'openingHours', 'deliveryPolicy']
  async function save() {
    try {
      await api.updateStoreSettings(store)
      onReload()
    } catch (error) {
      alert(`Chưa lưu được vì API chưa kết nối: ${error.message}`)
    }
  }
  return (
    <section className="card p-5">
      <h2 className="text-xl font-bold">Thông tin cửa hàng</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field}>
            <span className="label">{field}</span>
            <input className="field" value={store[field] || ''} onChange={(event) => setStore({ ...store, [field]: event.target.value })} />
          </label>
        ))}
      </div>
      <button className="btn-primary mt-5" onClick={save}>Lưu cài đặt</button>
    </section>
  )
}

export default AdminDashboard


