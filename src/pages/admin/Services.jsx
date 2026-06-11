import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SimpleTable from '../../components/common/SimpleTable'
import { useAdminData } from '../../hooks/useAdminData'
import { useToast } from '../../hooks/useToast'
import { api } from '../../services/api'

const emptyService = { name: '', description: '', isActive: true, sortOrder: 0 }

function ServicesPage() {
  const { services, loading, error, loadAdmin } = useAdminData()
  const [draft, setDraft] = useState(emptyService)
  const toast = useToast()

  async function save() {
    try {
      await api.saveService(draft)
      toast.success(draft.id ? 'Đã cập nhật dịch vụ.' : 'Đã thêm dịch vụ mới.')
      setDraft(emptyService)
      loadAdmin()
    } catch (err) {
      toast.error(err.message, draft.id ? 'Chưa cập nhật được dịch vụ' : 'Chưa lưu được dịch vụ')
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa dịch vụ này?')) return
    try {
      await api.deleteService(id)
      toast.success('Đã xóa dịch vụ.')
      loadAdmin()
    } catch (err) {
      toast.error(err.message, 'Chưa xóa được dịch vụ')
    }
  }

  const columns = [
    { key: 'name', label: 'Tên dịch vụ', render: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
    { key: 'description', label: 'Mô tả' },
    { key: 'isActive', label: 'Hiển thị', render: (row) => (row.isActive === false ? 'Tắt' : 'Bật') },
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
      <PageHeader title="Dịch vụ" description="Quản lý các dịch vụ giặt sấy hiển thị trên website." />
      <div className="space-y-6 p-6">
        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải dịch vụ...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{draft.id ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.5fr_140px]">
            <input className="field" placeholder="Tên dịch vụ" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <input className="field" placeholder="Mô tả ngắn" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            <button className="btn-primary" onClick={save}>{draft.id ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
          {draft.id && (
            <button className="btn-secondary mt-3 py-2" onClick={() => setDraft(emptyService)}>
              Hủy sửa
            </button>
          )}
        </section>

        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <SimpleTable columns={columns} rows={services} emptyText="Chưa có dịch vụ" />
        </section>
      </div>
    </>
  )
}

export default ServicesPage
