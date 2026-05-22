import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const UsersListPage = lazy(() => import('@/pages/users/list/UsersListPage'));

export const userRoutes: RouteWithMeta[] = [
  {
    path: 'users',
    meta: {
      label: '사용자 관리',
      icon: '👥',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <UsersListPage />,
        meta: {
          label: '사용자 목록',
        }
      }
    ]
  }
];
