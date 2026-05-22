import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { routes } from '@/router/routes'
import type { RouteWithMeta } from '@/router/types'
import {ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons"

interface MenuItem {
  label: string
  path: string
  icon?: string
  children?: MenuItem[]
}

const buildMenuItems = (routeList: RouteWithMeta[], parentPath = ''): MenuItem[] => {
  const items: MenuItem[] = []

  routeList.forEach(route => {
    if (route.meta?.showInMenu) {
      const fullPath = route.path?.startsWith('/')
        ? route.path
        : `${parentPath}/${route.path || ''}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'

      const menuItem: MenuItem = {
        label: route.meta.label || '',
        path: fullPath,
        icon: route.meta.icon
      }

      if (route.children && route.children.length > 0) {
        const childMenuItems = buildMenuItems(route.children, fullPath)
        if (childMenuItems.length > 0) {
          menuItem.children = childMenuItems
        }
      }

      items.push(menuItem)
    }
  })

  return items
}

const getAdminRoutes = (): RouteWithMeta[] => {
  const rootRoute = routes.find(r => r.path === '/')
  if (!rootRoute?.children) return []

  const adminLayoutRoute = rootRoute.children.find(r => r.path === '')
  if (!adminLayoutRoute?.children) return []

  return adminLayoutRoute.children
}

export default function Sidebar() {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const adminRoutes = useMemo(() => getAdminRoutes(), [])
  const menuStructure = useMemo(() => buildMenuItems(adminRoutes), [adminRoutes])

  useEffect(() => {
    const currentPath = location.pathname
    const parentsToExpand: string[] = []

    menuStructure.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          currentPath === child.path || currentPath.startsWith(child.path + '/')
        )

        if (hasActiveChild && !parentsToExpand.includes(item.path)) {
          parentsToExpand.push(item.path)
        }
      }
    })

    if (parentsToExpand.length > 0) {
      setExpandedMenus(prev => {
        const allExpanded = parentsToExpand.every(path => prev.includes(path))
        if (allExpanded) {
          return prev
        }

        const newExpanded = [...prev]
        parentsToExpand.forEach(path => {
          if (!newExpanded.includes(path)) {
            newExpanded.push(path)
          }
        })
        return newExpanded
      })
    }
  }, [location.pathname, menuStructure])

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside className="w-64 bg-[var(--Stone-100)] text-[var(--Stone-900)] min-h-screen flex flex-col">
      <nav className="">
        {menuStructure.map(item => (
          <div key={item.path}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--sidebar-hover)] transition-colors ${
                    isActive(item.path) ? 'text-[var(--primary-500)]' : ''
                  }`}
                >
                  <div className="flex items-center" >
                    {item.icon && <span className="mr-3 text-lg" style={{ fontSize: '16px', fontWeight: '500' }}>{item.icon}</span>}
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>{item.label}</span>
                  </div>
                  <span>
                    {expandedMenus.includes(item.path) ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                  </span>
                </button>

                {expandedMenus.includes(item.path) && (
                  <div className="bg-[var(--sidebar-submenu-bg)]">
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2 pl-12 text-sm hover:bg-[var(--sidebar-hover)] transition-colors ${
                          location.pathname === child.path || location.pathname.startsWith(child.path + '/')
                            ? ' font-medium text-[var(--primary-500)]'
                            : ''
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 hover:bg-[var(--sidebar-hover)] transition-colors ${
                  isActive(item.path) ? 'text-[var(--primary-500)]' : ''
                }`}
              >
                {item.icon && <span className="mr-3 text-lg" style={{ fontSize: '16px', fontWeight: '500' }}>{item.icon}</span>}
                <span style={{ fontSize: '16px', fontWeight: '500' }}>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
