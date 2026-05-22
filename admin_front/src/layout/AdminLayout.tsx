import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumb from './Breadcrumb'

export default function AdminLayout() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="w-full p-6">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  )
}