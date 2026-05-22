import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const ToolsListPage = lazy(() => import('@/pages/products/list/ToolsListPage'));

export const toolRoutes: RouteWithMeta[] = [
  {
    path: 'products',
    meta: {
      label: 'AI 도구 관리',
      icon: '⚙️',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <ToolsListPage />,
        meta: {
          label: '도구 목록',
        }
      }
    ]
  }
];
