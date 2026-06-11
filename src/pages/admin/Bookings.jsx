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

function BookingsPage() {
  const [status, setStatus] = useState('')
  const [filters, setFilters] = useState({ search: '', service: '', pickupDate: '' })
  const { bookings, loading, error, loadAdmin } = useAdminData(status)
  const toast = useToast()

  const serviceOptions = useMemo(() => {
    const names = bookings.map((row) => row.serviceName || row.service?.name).filter(Boolean)
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'vi'))
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase()

    return bookings.filter((row) => {
      const serviceName = row.serviceName || row.service?.name || ''
      const mapLink = getGoogleMapLink(row)
      const pickupDate = row.pickupTime ? new Date(row.pickupTime).toISOString().slice(0, 10) : ''
      const haystack = [
        row.customerName,
        row.phone,
        row.address,
        row.addressNote,
        row.note,
        serviceName,
        mapLink,
      ].filter(Boolean).join(' ').toLowerCase()

      return (
        (!searchText || haystack.includes(searchText)) &&
        (!filters.service || serviceName === filters.service) &&
        (!filters.pickupDate || pickupDate === filters.pickupDate)
      )
    })
  }, [bookings, filters])

  function resetFilters() {
    setStatus('')
    setFilters({ search: '', service: '', pickupDate: '' })
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
    { key: 'pickupTime', label: 'Giờ hẹn', render: (row) => (row.pickupTime ? new Date(row.pickupTime).toLocaleString('vi-VN') : '') },
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
        <select className="field h-11 w-56" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </PageHeader>

      <div className="space-y-4 p-6">
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr_0.85fr_auto]">
            <label className="block">
              <span className="label">Tìm kiếm</span>
              <input
                className="field h-11"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Tên khách, SĐT, địa chỉ, link map..."
              />
            </label>
            <label className="block">
              <span className="label">Dịch vụ</span>
              <select className="field h-11" value={filters.service} onChange={(event) => setFilters((current) => ({ ...current, service: event.target.value }))}>
                <option value="">Tất cả dịch vụ</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label">Ngày hẹn</span>
              <input
                className="field h-11"
                type="date"
                value={filters.pickupDate}
                onChange={(event) => setFilters((current) => ({ ...current, pickupDate: event.target.value }))}
              />
            </label>
            <div className="flex items-end">
              <button className="btn-secondary h-11 whitespace-nowrap px-4 py-2" type="button" onClick={resetFilters}>
                Xóa lọc
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Đang hiển thị <strong className="text-gray-900">{filteredBookings.length}</strong> / {bookings.length} đơn.
          </p>
        </section>

        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải danh sách đơn...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <SimpleTable columns={columns} rows={filteredBookings} emptyText="Không có đơn phù hợp bộ lọc" />
        </section>
      </div>
    </>
  )
}

export default BookingsPage
