import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const CategoriesListPage = lazy(() => import('@/pages/categories/list/CategoriesListPage'));

export const categoryRoutes: RouteWithMeta[] = [
  {
    path: 'category',
    meta: {
      label: '카테고리 관리',
      icon: '📂',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <CategoriesListPage />,
        meta: {
          label: '카테고리 목록',
        }
      }
    ]
  }
];
