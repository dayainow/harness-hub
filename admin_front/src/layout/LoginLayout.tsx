import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function LoginLayout() {
  return (
    <div className="">
      <Header />
      <main className="flex-1 ">
        <Outlet />
      </main>
    </div>
  )
}