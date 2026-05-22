// React Router
import { Navigate } from 'react-router-dom'

// Layouts & Components
import AdminLayout from '@/layout/AdminLayout'
import LoginLayout from '@/layout/LoginLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LoginPage from '@/pages/login/LoginPage'
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

// Route Modules
import { userRoutes } from './routes/userRoutes'
import { toolRoutes } from './routes/toolRoutes'
import { labRoutes } from './routes/labRoutes'
import { promptRoutes } from './routes/promptRoutes'
import { postRoutes } from './routes/postRoutes'
import { categoryRoutes } from './routes/categoryRoutes'

// Types
import type { RouteWithMeta } from './types'

export const routes: RouteWithMeta[] = [
  // 로그인
  {
    path: '/login',
    element: <LoginLayout />,
    children: [
      {
        path: '',
        element: <LoginPage />,
      }
    ]
  },

  // 관리자 페이지 (인증 필요)
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          // 대시보드 (메인 페이지)
          {
            index: true,
            element: <Suspense fallback={<div className="p-8 text-slate-400">로딩 중...</div>}><DashboardPage /></Suspense>,
            meta: {
              label: '대시보드',
              icon: '📊',
              showInMenu: true,
            }
          },

          // 도메인별 관리 라우트 목록
          ...userRoutes,
          ...toolRoutes,
          ...labRoutes,
          ...promptRoutes,
          ...postRoutes,
          ...categoryRoutes,
        ]
      }
    ]
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]
