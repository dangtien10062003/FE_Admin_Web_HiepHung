import { useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SimpleTable from '../../components/common/SimpleTable'
import StatusBadge from '../../components/common/StatusBadge'
import { statusLabels, useAdminData } from '../../hooks/useAdminData'
import { useToast } from '../../hooks/useToast'
import { api } from '../../services/api'

const mapLinkPattern = /https?:\/\/(?:www\.)?(?:google\.[^\s]+\/maps|maps\.app\.goo\.gl)[^\s)]+/i

function cleanMapLink(value = '') {
  return value.trim().replace(/[.,;]+$/, '')
}

function getGoogleMapLink(row) {
  const directLink = row.googleMapUrl || row.googleMapsUrl || row.mapUrl || row.locationUrl
  if (directLink) return cleanMapLink(directLink)

  const noteLink = `${row.note || ''} ${row.addressNote || ''}`.match(mapLinkPattern)?.[0]
  if (noteLink) return cleanMapLink(noteLink)

  if (row.latitude && row.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`
  }

  if (row.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.address)}`
  }

  return ''
}

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('vi-VN') : ''
}

function BookingsPage() {
  const [status, setStatus] = useState('')
  const [filters, setFilters] = useState({ search: '', service: '', pickupDate: '', orderDateMode: '', orderDateValue: '' })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })
  const bookingQuery = useMemo(() => ({ ...filters, page: pagination.page, pageSize: pagination.pageSize }), [filters, pagination])
  const { bookings, bookingPage, services, loading, error, loadAdmin } = useAdminData(status, bookingQuery)
  const toast = useToast()

  const serviceOptions = useMemo(() => {
    const names = services.map((row) => row.name).filter(Boolean)
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'vi'))
  }, [services])

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
    setPagination((current) => ({ ...current, page: 1 }))
  }

  function setStatusFilter(value) {
    setStatus(value)
    setPagination((current) => ({ ...current, page: 1 }))
  }

  function resetFilters() {
    setStatus('')
    setFilters({ search: '', service: '', pickupDate: '', orderDateMode: '', orderDateValue: '' })
    setPagination({ page: 1, pageSize: 10 })
  }

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
    { key: 'createdAt', label: 'Ngày đặt', render: (row) => formatDateTime(row.createdAt) },
    { key: 'pickupTime', label: 'Ngày giao', render: (row) => formatDateTime(row.pickupTime) },
    {
      key: 'googleMap',
      label: 'Google Maps',
      render: (row) => {
        const mapLink = getGoogleMapLink(row)
        return mapLink ? (
          <a className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100" href={mapLink} target="_blank" rel="noreferrer">
            Mở map
          </a>
        ) : (
          <span className="text-xs text-gray-400">Chưa có link</span>
        )
      },
    },
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
        <select className="field h-11 w-56" value={status} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </PageHeader>

      <div className="space-y-4 p-6">
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.25fr_0.9fr_0.75fr_0.75fr_0.85fr_auto]">
            <label className="block">
              <span className="label">Tìm kiếm</span>
              <input
                className="field h-11"
                value={filters.search}
                onChange={(event) => setFilter('search', event.target.value)}
                placeholder="Tên khách, SĐT, địa chỉ, link map..."
              />
            </label>
            <label className="block">
              <span className="label">Dịch vụ</span>
              <select className="field h-11" value={filters.service} onChange={(event) => setFilter('service', event.target.value)}>
                <option value="">Tất cả dịch vụ</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label">Ngày giao</span>
              <input
                className="field h-11"
                type="date"
                value={filters.pickupDate}
                onChange={(event) => setFilter('pickupDate', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="label">Lọc ngày đặt</span>
              <select
                className="field h-11"
                value={filters.orderDateMode}
                onChange={(event) => {
                  setFilters((current) => ({ ...current, orderDateMode: event.target.value, orderDateValue: '' }))
                  setPagination((current) => ({ ...current, page: 1 }))
                }}
              >
                <option value="">Tất cả</option>
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
              </select>
            </label>
            <label className="block">
              <span className="label">Giá trị lọc</span>
              <input
                className="field h-11 disabled:bg-gray-100"
                type={filters.orderDateMode === 'week' ? 'week' : filters.orderDateMode === 'month' ? 'month' : 'date'}
                value={filters.orderDateValue}
                disabled={!filters.orderDateMode}
                onChange={(event) => setFilter('orderDateValue', event.target.value)}
              />
            </label>
            <div className="flex items-end">
              <button className="btn-secondary h-11 whitespace-nowrap px-4 py-2" type="button" onClick={resetFilters}>
                Xóa lọc
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Đang hiển thị <strong className="text-gray-900">{bookings.length}</strong> / {bookingPage.total} đơn.
          </p>
        </section>

        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải danh sách đơn...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <SimpleTable columns={columns} rows={bookings} emptyText="Không có đơn phù hợp bộ lọc" />
        </section>
        <section className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Hiển thị
            <select
              className="field h-10 w-24"
              value={pagination.pageSize}
              onChange={(event) => setPagination({ page: 1, pageSize: Number(event.target.value) })}
            >
              {[10, 20, 30].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            đơn/trang
          </label>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary h-10 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={bookingPage.page <= 1}
              onClick={() => setPagination((current) => ({ ...current, page: Math.max(1, current.page - 1) }))}
            >
              Trước
            </button>
            <span className="min-w-28 text-center text-sm font-semibold text-gray-700">
              Trang {bookingPage.page} / {bookingPage.totalPages}
            </span>
            <button
              className="btn-secondary h-10 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={bookingPage.page >= bookingPage.totalPages}
              onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
            >
              Sau
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

export default BookingsPage
