export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  getServices: () => request('/services'),
  getPrices: () => request('/prices'),
  getStoreSettings: () => request('/store-settings'),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  adminBookings: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, value)
    })
    const queryText = query.toString()
    return request(`/admin/bookings${queryText ? `?${queryText}` : ''}`)
  },
  adminBooking: (id) => request(`/admin/bookings/${id}`),
  updateBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  adminServices: () => request('/admin/services'),
  saveService: (service) => request(`/admin/services${service.id ? `/${service.id}` : ''}`, { method: service.id ? 'PUT' : 'POST', body: JSON.stringify(service) }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),
  adminPrices: () => request('/admin/prices'),
  savePrice: (price) => request(`/admin/prices${price.id ? `/${price.id}` : ''}`, { method: price.id ? 'PUT' : 'POST', body: JSON.stringify(price) }),
  deletePrice: (id) => request(`/admin/prices/${id}`, { method: 'DELETE' }),
  updateStoreSettings: (payload) => request('/admin/store-settings', { method: 'PUT', body: JSON.stringify(payload) }),
}
