import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SimpleTable from '../../components/common/SimpleTable'
import { useAdminData } from '../../hooks/useAdminData'
import { useToast } from '../../hooks/useToast'
import { api } from '../../services/api'

const emptyPrice = { name: '', priceText: '', note: '', isActive: true, sortOrder: 0 }

function PricesPage() {
  const { prices, loading, error, loadAdmin } = useAdminData()
  const [draft, setDraft] = useState(emptyPrice)
  const toast = useToast()

  async function save() {
    try {
      await api.savePrice(draft)
      toast.success(draft.id ? 'Đã cập nhật mục giá.' : 'Đã thêm mục giá mới.')
      setDraft(emptyPrice)
      loadAdmin()
    } catch (err) {
      toast.error(err.message, draft.id ? 'Chưa cập nhật được bảng giá' : 'Chưa lưu được bảng giá')
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa mục giá này?')) return
    try {
      await api.deletePrice(id)
      toast.success('Đã xóa mục giá.')
      loadAdmin()
    } catch (err) {
      toast.error(err.message, 'Chưa xóa được mục giá')
    }
  }

  const columns = [
    { key: 'name', label: 'Tên mục', render: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
    { key: 'priceText', label: 'Giá' },
    { key: 'note', label: 'Ghi chú' },
    {
      key: 'action',
      label: 'Thao tác',
      render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary h-9 px-3 py-0" onClick={() => setDraft(row)}>Sửa</button>
          <button className="btn-secondary h-9 px-3 py-0" onClick={() => remove(row.id)}>Xóa</button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Bảng giá" description="Cập nhật các mức giá đang hiển thị trên website khách." />
      <div className="space-y-6 p-6">
        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải bảng giá...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{draft.id ? 'Cập nhật mục giá' : 'Thêm mục giá'}</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1.3fr_140px]">
            <input className="field" placeholder="Tên mục" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <input className="field" placeholder="Giá" value={draft.priceText} onChange={(event) => setDraft({ ...draft, priceText: event.target.value })} />
            <input className="field" placeholder="Ghi chú" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
            <button className="btn-primary" onClick={save}>{draft.id ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
          {draft.id && (
            <button className="btn-secondary mt-3 py-2" onClick={() => setDraft(emptyPrice)}>
              Hủy sửa
            </button>
          )}
        </section>

        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <SimpleTable columns={columns} rows={prices} emptyText="Chưa có bảng giá" />
        </section>
      </div>
    </>
  )
}

export default PricesPage
