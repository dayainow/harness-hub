import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const PromptsListPage = lazy(() => import('@/pages/prompts/list/PromptsListPage'));

export const promptRoutes: RouteWithMeta[] = [
  {
    path: 'prompts',
    meta: {
      label: '프롬프트 관리',
      icon: '💬',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <PromptsListPage />,
        meta: {
          label: '프롬프트 목록',
        }
      }
    ]
  }
];
