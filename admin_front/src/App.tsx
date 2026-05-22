import { BrowserRouter, useRoutes, RouteObject } from 'react-router-dom'
import { QueryProvider } from './providers/query-provider'
import { routes } from './router/routes'

function AppRoutes() {
  return useRoutes(routes as RouteObject[])
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App