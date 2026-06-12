import { CalendarCheck, CheckCircle2, Shirt, Tags } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import SimpleTable from '../../components/common/SimpleTable'
import { statusLabels, useAdminData } from '../../hooks/useAdminData'

function DashboardPage() {
  const { bookings, services, prices, store, loading, error, offlineMode } = useAdminData()
  const completed = bookings.filter((booking) => booking.status === 'Completed').length

  const columns = [
    { key: 'customerName', label: 'Khách hàng' },
    { key: 'serviceName', label: 'Dịch vụ', render: (row) => row.serviceName || row.service?.name },
    { key: 'pickupTime', label: 'Giờ hẹn', render: (row) => (row.pickupTime ? new Date(row.pickupTime).toLocaleString('vi-VN') : '') },
    { key: 'status', label: 'Trạng thái', render: (row) => <StatusBadge status={row.status}>{statusLabels[row.status] || row.status}</StatusBadge> },
  ]

  return (
    <>
      <PageHeader
        title="Tổng quan vận hành"
        description="Bảng điều khiển nhanh cho đơn đặt lịch, dịch vụ, bảng giá và thông tin cửa hàng."
      >
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          API: {offlineMode ? 'dữ liệu mẫu' : 'đã kết nối'}
        </span>
      </PageHeader>

      <div className="space-y-6 p-6">
        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải dữ liệu...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard to="/bookings" label="Tổng đơn" value={bookings.length} hint="Theo bộ lọc hiện tại" icon={CalendarCheck} />
          <StatCard to="/bookings" label="Đơn hoàn tất" value={completed} hint="Đã xử lý xong" icon={CheckCircle2} />
          <StatCard to="/services" label="Dịch vụ" value={services.length} hint="Dịch vụ đang quản lý" icon={Shirt} />
          <StatCard to="/prices" label="Bảng giá" value={prices.length} hint="Mục giá hiển thị" icon={Tags} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900">Đơn mới gần đây</h2>
              <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" to="/bookings">Xem tất cả</Link>
            </div>
            <SimpleTable columns={columns} rows={bookings.slice(0, 6)} />
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900">Thông tin cửa hàng</h2>
              <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" to="/store">Chỉnh sửa</Link>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <Info label="Tên" value={store.brandName} />
              <Info label="Hotline" value={store.hotline} />
              <Info label="Địa chỉ" value={store.address} />
              <Info label="Giờ làm việc" value={store.openingHours} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 font-medium text-gray-800">{value}</p>
    </div>
  )
}

export default DashboardPage
