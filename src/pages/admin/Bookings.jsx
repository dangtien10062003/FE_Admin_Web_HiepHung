import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SimpleTable from '../../components/common/SimpleTable'
import StatusBadge from '../../components/common/StatusBadge'
import { api } from '../../services/api'
import { statusLabels, useAdminData } from '../../hooks/useAdminData'
import { useToast } from '../../hooks/useToast'

function BookingsPage() {
  const [status, setStatus] = useState('')
  const { bookings, loading, error, loadAdmin } = useAdminData(status)
  const toast = useToast()

  async function update(id, nextStatus) {
    try {
      await api.updateBookingStatus(id, nextStatus)
      toast.success(`Đã chuyển đơn #${id} sang ${statusLabels[nextStatus] || nextStatus}.`)
      loadAdmin()
    } catch (err) {
      toast.error(err.message, 'Chưa cập nhật được trạng thái')
    }
  }

  const columns = [
    {
      key: 'customerName',
      label: 'Khách',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customerName}</p>
          <p className="mt-1 text-xs text-gray-500">{row.address}</p>
        </div>
      ),
    },
    { key: 'phone', label: 'Liên hệ' },
    { key: 'serviceName', label: 'Dịch vụ', render: (row) => row.serviceName || row.service?.name },
    { key: 'pickupTime', label: 'Giờ hẹn', render: (row) => (row.pickupTime ? new Date(row.pickupTime).toLocaleString('vi-VN') : '') },
    { key: 'status', label: 'Trạng thái', render: (row) => <StatusBadge status={row.status}>{statusLabels[row.status] || row.status}</StatusBadge> },
    {
      key: 'action',
      label: 'Cập nhật',
      render: (row) => (
        <select className="field h-11 min-w-40" value={row.status} onChange={(event) => update(row.id, event.target.value)}>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Đơn đặt lịch" description="Theo dõi và cập nhật trạng thái xử lý đơn của khách.">
        <select className="field h-11 w-56" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </PageHeader>
      <div className="space-y-4 p-6">
        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải danh sách đơn...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <SimpleTable columns={columns} rows={bookings} emptyText="Chưa có đơn đặt lịch" />
        </section>
      </div>
    </>
  )
}

export default BookingsPage
