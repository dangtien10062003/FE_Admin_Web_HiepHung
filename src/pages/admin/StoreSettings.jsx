import PageHeader from '../../components/common/PageHeader'
import { defaultStore, useAdminData } from '../../hooks/useAdminData'
import { useToast } from '../../hooks/useToast'
import { api } from '../../services/api'

const fields = [
  ['brandName', 'Tên thương hiệu'],
  ['address', 'Địa chỉ'],
  ['hotline', 'Hotline'],
  ['zaloUrl', 'Link Zalo'],
  ['facebookUrl', 'Link Facebook'],
  ['openingHours', 'Giờ làm việc'],
  ['deliveryPolicy', 'Chính sách giao nhận'],
]

function StoreSettingsPage() {
  const { store, setStore, loading, error, loadAdmin } = useAdminData()
  const toast = useToast()

  async function save() {
    try {
      await api.updateStoreSettings({ ...defaultStore, ...store })
      await loadAdmin()
      toast.success('Đã lưu thông tin cửa hàng.')
    } catch (err) {
      toast.error(err.message, 'Chưa lưu được thông tin cửa hàng')
    }
  }

  return (
    <>
      <PageHeader title="Thông tin cửa hàng" description="Quản lý thương hiệu, địa chỉ, hotline, giờ làm việc và liên kết liên hệ." />
      <div className="space-y-6 p-6">
        {loading && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Đang tải thông tin cửa hàng...</p>}
        {error && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([name, label]) => (
              <label key={name} className={name === 'address' || name === 'deliveryPolicy' ? 'md:col-span-2' : ''}>
                <span className="label">{label}</span>
                <input
                  className="field"
                  value={store[name] || ''}
                  onChange={(event) => setStore({ ...store, [name]: event.target.value })}
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary" onClick={save}>Lưu cài đặt</button>
          </div>
        </section>
      </div>
    </>
  )
}

export default StoreSettingsPage
