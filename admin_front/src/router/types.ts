import { ReactNode } from 'react'

/**
 * 메타데이터를 포함한 라우트 타입
 * Sidebar와 Breadcrumb에서 사용
 */
export interface RouteWithMeta {
  path?: string
  index?: boolean
  element?: ReactNode
  children?: RouteWithMeta[]
  meta?: {
    label?: string        // 메뉴/브레드크럼에 표시될 이름
    showInMenu?: boolean  // 메뉴에 표시 여부 (기본: false, true일 때만 사이드바에 표시)
    icon?: string         // 아이콘
  }
}