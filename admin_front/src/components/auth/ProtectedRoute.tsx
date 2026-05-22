import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth_store'

export default function ProtectedRoute() {
  const { admin } = useAuthStore()

  if (!admin )  {
    return <Navigate to="/login" replace />
  }
  // 로그인한 경우 자식 라우트 렌더링
  return <Outlet />
}