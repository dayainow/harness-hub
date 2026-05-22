import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const PostsListPage = lazy(() => import('@/pages/posts/list/PostsListPage'));

export const postRoutes: RouteWithMeta[] = [
  {
    path: 'posts',
    meta: {
      label: '커뮤니티 관리',
      icon: '📝',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <PostsListPage />,
        meta: {
          label: '게시글 목록',
        }
      }
    ]
  }
];
