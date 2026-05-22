import { Link, useLocation } from 'react-router-dom'
import { routes } from '@/router/routes'
import type { RouteWithMeta } from '@/router/types'

interface BreadcrumbItem {
  label: string
  path?: string  // If path is absent, display as text instead of a link
}

// Extract AdminLayout's children from routes
const getAdminRoutes = (): RouteWithMeta[] => {
  const rootRoute = routes.find(r => r.path === '/')
  if (!rootRoute?.children) return []

  const adminLayoutRoute = rootRoute.children.find(r => r.path === '')
  if (!adminLayoutRoute?.children) return []

  return adminLayoutRoute.children
}

// Path matching with dynamic parameter support
const matchPath = (routePath: string, targetPath: string): boolean => {
  const routeParts = routePath.split('/').filter(Boolean)
  const targetParts = targetPath.split('/').filter(Boolean)

  if (routeParts.length !== targetParts.length) {
    return false
  }

  for (let i = 0; i < routeParts.length; i++) {
    // Dynamic parameters like :id match any value
    if (routeParts[i].startsWith(':')) {
      continue
    }
    // Static segments must match exactly
    if (routeParts[i] !== targetParts[i]) {
      return false
    }
  }

  return true
}

// Recursively find a route
const findRouteByPath = (routeList: RouteWithMeta[], targetPath: string, parentPath = ''): RouteWithMeta | null => {
  for (const route of routeList) {
    // Calculate the full path of the current route
    const currentPath = route.path?.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path || ''}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'

    // Path matching with dynamic parameter support
    if (matchPath(currentPath, targetPath)) {
      return route
    }

    // If children exist, search recursively
    if (route.children && route.children.length > 0) {
      const found = findRouteByPath(route.children, targetPath, currentPath)
      if (found) {
        return found
      }
    }
  }

  return null
}

// Build breadcrumb items for the given path
const buildBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = []

  // Add Home
  items.push({
    label: 'Home',
    path: '/'
  })

  // Split pathname and find routes at each depth
  const pathParts = pathname.split('/').filter(Boolean)
  const adminRoutes = getAdminRoutes()

  let currentPath = ''
  for (let i = 0; i < pathParts.length; i++) {
    currentPath += '/' + pathParts[i]

    const route = findRouteByPath(adminRoutes, currentPath)

    if (route?.meta?.label) {
      const isLast = i === pathParts.length - 1

      // Remove link for routes that have no element and only children (not clickable)
      const hasElement = route.element !== undefined
      const hasOnlyChildren = !hasElement && route.children && route.children.length > 0

      items.push({
        label: route.meta.label,
        // Remove link if it's the last item, or if the route has no element and only children
        path: (isLast || hasOnlyChildren) ? undefined : currentPath
      })
    }
  }

  return items
}

export default function Breadcrumb() {
  const location = useLocation()
  const breadcrumbItems = buildBreadcrumbItems(location.pathname)

  // Do not display breadcrumb if only Home is present
  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <span className="text-gray-400">&gt;</span>}
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-900">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}