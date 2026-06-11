import { CalendarCheck, Home, ListChecks, Settings, Shirt, Tags } from 'lucide-react'

export const navigationItems = [
  { id: 'dashboard', name: 'Tổng quan', to: '/', icon: Home },
  { id: 'bookings', name: 'Đơn đặt lịch', to: '/bookings', icon: CalendarCheck },
  {
    id: 'catalog',
    name: 'Nội dung dịch vụ',
    icon: ListChecks,
    children: [
      { id: 'services', name: 'Dịch vụ', to: '/services', icon: Shirt },
      { id: 'prices', name: 'Bảng giá', to: '/prices', icon: Tags },
    ],
  },
  { id: 'store', name: 'Thông tin cửa hàng', to: '/store', icon: Settings },
]
