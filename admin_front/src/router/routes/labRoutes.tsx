import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const LabsListPage = lazy(() => import('@/pages/market/list/LabsListPage'));

export const labRoutes: RouteWithMeta[] = [
  {
    path: 'market',
    meta: {
      label: '실험실 관리',
      icon: '🧪',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <LabsListPage />,
        meta: {
          label: '실험실 목록',
        }
      }
    ]
  }
];
