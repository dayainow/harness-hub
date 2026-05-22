import { Suspense, LazyExoticComponent, ComponentType } from 'react'

/**
 * Suspense wrapper for lazy-loaded components
 * 지연 로딩된 컴포넌트를 Suspense로 감싸서 로딩 상태를 표시합니다.
 */
export const withSuspense = (Component: LazyExoticComponent<ComponentType<any>>) => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  }>
    <Component />
  </Suspense>
)
