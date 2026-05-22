# React Admin Dashboard Boilerplate

A production-ready admin dashboard boilerplate built with React 19, TypeScript 5, and Tailwind CSS 4. Designed to help you rapidly build internal products, back-office systems, and admin panels.

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | React 19 + TypeScript 5 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 + CSS Variables |
| UI | shadcn/ui (Radix UI) + Lucide Icons |
| State | Zustand 5 (with persist middleware) |
| Server State | TanStack React Query 5 |
| API | Axios (interceptors, error handling) |
| Forms | React Hook Form 7 + Zod 4 |
| Routing | React Router DOM 6 (lazy loading) |
| Editor | Lexical (rich text, image upload) |

---

## Getting Started

### 1. Clone the project

```bash
git clone <repository-url> my-admin
cd my-admin
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and configure your API server address:

```env
VITE_BASE_URL=http://localhost:8080/api   # Backend API URL
VITE_ADMIN_URL=http://localhost:3000      # Frontend URL
VITE_USE_MOCK_AUTH=true                   # Use mock login (no backend required)
```

> **Mock Authentication**: Set `VITE_USE_MOCK_AUTH=true` to test the app without a backend server.
> - **Login ID**: `admin`
> - **Password**: `admin123`
>
> Set to `false` when connecting to a real backend API.

### 3. Install dependencies and run

```bash
yarn install
yarn dev       # Dev server (http://localhost:3000)
yarn build     # Production build
yarn preview   # Preview production build
```

---

## Project Structure

```
src/
├── components/
│   ├── auth/               # Auth guard (ProtectedRoute)
│   ├── ui/                 # shadcn/ui base components (27)
│   ├── common/             # Shared business components (17)
│   └── editor/             # Lexical rich text editor
├── constants/
│   └── api-paths.ts        # API endpoint constants
├── hooks/
│   ├── useListFilters.ts   # List filter/pagination/search hook
│   └── useDialogForm.ts    # Dialog form management hook
├── layout/
│   ├── AdminLayout.tsx     # Main layout (Header + Sidebar + Content)
│   ├── LoginLayout.tsx     # Login layout
│   ├── Header.tsx          # Top header bar
│   ├── Sidebar.tsx         # Left sidebar (auto-generated from route metadata)
│   └── Breadcrumb.tsx      # Breadcrumb (auto-generated from route paths)
├── lib/
│   ├── api.ts              # Axios wrapper (interceptors, error handling, upload)
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── formatDate.ts       # dayjs date formatting utilities
│   └── uuid.ts             # UUID generation
├── models/
│   ├── model.ts            # Common API response/request types
│   ├── auth.ts             # Auth types + StorageService
│   └── example.ts          # [Example] entity types
├── pages/
│   ├── login/              # Login page
│   └── example/            # [Example] CRUD pages (list/detail/create)
├── providers/
│   └── query-provider.tsx  # React Query Provider
├── router/
│   ├── routes.tsx          # Main route definitions
│   ├── types.ts            # RouteWithMeta type
│   ├── routes/             # Feature-based route modules
│   └── utils/              # withSuspense utility
├── stores/
│   ├── auth_store.ts       # Auth store
│   ├── upload_store.ts     # File upload store
│   ├── page_filter_store.ts # Page filter factory
│   └── example_store.ts    # [Example] CRUD store
├── styles/
│   └── variables.css       # CSS variables (color palette)
├── globals.css             # Global styles + fonts
├── App.tsx
└── main.tsx
```

---

## Adding a New Feature

Here's how to add a new management feature (e.g., "Product Management"):

### Step 1. Define the model

`src/models/product.ts`

```typescript
export interface Product {
  id: number
  name: string
  price: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  name: string
  price: number
  status: 'active' | 'inactive'
}
```

### Step 2. Add API paths

`src/constants/api-paths.ts`

```typescript
export const API_PREFIX = {
  AUTH: '/auth',
  EXAMPLE: '/examples',
  PRODUCT: '/products',      // Add this
} as const

// Add this
export const PRODUCT_API = {
  PREFIX: API_PREFIX.PRODUCT,
  ID: (id: number) => `${API_PREFIX.PRODUCT}/${id}`,
} as const
```

### Step 3. Create a store

`src/stores/product_store.ts` — Copy and modify `example_store.ts`.

```typescript
import { create } from "zustand"
import { apiService } from "@/lib/api"
import { PRODUCT_API } from "@/constants/api-paths"
import { Product, ProductRequest } from "@/models/product"
import { IResponseList, IRequestFilter } from "@/models/model"

interface ProductState {
  list: Product[] | null
  total: number
  loading: boolean
  error: string | null
  getList: (params?: IRequestFilter) => Promise<IResponseList<Product>>
  getDetail: (id: number) => Promise<{ data: Product }>
  add: (data: ProductRequest) => Promise<boolean>
  update: (id: number, data: ProductRequest) => Promise<boolean>
  remove: (id: number) => Promise<boolean>
}

export const useProductStore = create<ProductState>((set) => ({
  // Follow the pattern in example_store.ts
}))
```

### Step 4. Add filter store (optional)

`src/stores/page_filter_store.ts`

```typescript
export const useProductFilterStore = createPageFilterStore('product', {
  searchOption: 'name',
  sortFilter: 'createdAt',
});
```

### Step 5. Create pages

Create the `src/pages/product/` directory and copy pages from `example/`:

- `ProductListPage.tsx` — Based on `ExampleListPage.tsx`
- `ProductDetailPage.tsx` — Based on `ExampleDetailPage.tsx`
- `ProductCreatePage.tsx` — Based on `ExampleCreatePage.tsx`

### Step 6. Register routes

`src/router/routes/productRoutes.tsx`

```typescript
import { RouteWithMeta } from '../types';
import { withSuspense } from '../utils/withSuspense';
import { lazy } from 'react';

const ProductListPage = withSuspense(lazy(() => import('@/pages/product/ProductListPage')));
const ProductDetailPage = withSuspense(lazy(() => import('@/pages/product/ProductDetailPage')));
const ProductCreatePage = withSuspense(lazy(() => import('@/pages/product/ProductCreatePage')));

export const productRoutes: RouteWithMeta[] = [
  {
    path: 'product',
    meta: { label: 'Products', showInMenu: true },
    children: [
      {
        index: true,
        element: ProductListPage,
        meta: { label: 'Product List', showInMenu: true },
      },
      {
        path: 'add',
        element: ProductCreatePage,
        meta: { label: 'Create Product', showInMenu: false },
      },
      {
        path: ':id',
        element: ProductDetailPage,
        meta: { label: 'Product Detail', showInMenu: false },
      },
    ],
  },
];
```

Add the import in `src/router/routes.tsx`:

```typescript
import { productRoutes } from './routes/productRoutes'

// Add to children array
...productRoutes,
```

> Routes with `meta.showInMenu: true` are **automatically displayed in the sidebar**.
> **Breadcrumbs** are also auto-generated based on route `meta.label` values.

---

## Key Components

### Tables

| Component | Purpose |
|-----------|---------|
| `BaseTable` | Standard list table (column definitions + row click) |
| `BaseVerticalTable` | Detail/create/edit form (view/edit/create modes) |
| `DialogTable` | Inline-editable table inside dialogs |

```typescript
// BaseTable column definitions
const columns: ColumnDef[] = [
  { key: 'id', label: 'ID', width: '5%' },
  { key: 'name', label: 'Name', width: '30%' },
  { key: 'status', label: 'Status', width: '10%' },
]

// BaseVerticalTable row definitions
const rows: VerticalRowDef[] = [
  { label: 'Name', key: 'name', type: 'text' },
  { label: 'Description', key: 'description', type: 'textarea' },
  { label: 'Active', key: 'isActive', type: 'toggle',
    toggleOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]
  },
  { label: 'Created', key: 'createdAt', type: 'text', editable: false },
]
```

### Dialogs

| Component | Purpose |
|-----------|---------|
| `ConfirmDialog` | Confirmation modal (e.g., delete) |
| `FormDialog` | Form input modal |
| `ContentDialog` | Content display modal |
| `ImageDialog` | Image zoom modal |
| `SelectDialog` | Data selection modal (search + pagination) |

### Search / Filter / Pagination

| Component | Purpose |
|-----------|---------|
| `SearchBox` | Search options + input + button |
| `FilterTabs` | Sort tabs + asc/desc toggle |
| `PageTabs` | In-page tab switching |
| `BasePagination` | Pagination + page size control |

### Input

| Component | Purpose |
|-----------|---------|
| `DatePicker` | Date selection |
| `MonthPicker` | Month selection |
| `FileUploadBox` | Image/video/audio file upload (S3 presigned URL) |
| `BaseButton` | Customizable color/variant button |

---

## useListFilters Hook

Synchronizes list page filters, search, sorting, and pagination with URL parameters.

```typescript
const filters = useListFilters({
  page: 1,
  limit: 30,
  sort: 'createdAt',
  order: 'desc',
  searchOption: 'title'
});

// Available properties/methods
filters.page                  // Current page
filters.limit                 // Page size
filters.sort                  // Sort field
filters.order                 // Sort direction ('asc' | 'desc')
filters.searchValue           // Search value (committed)
filters.searchOption          // Search option
filters.localSearchValue      // Search input (local)
filters.localSearchOption     // Search option (local)

filters.setPage(2)            // Change page
filters.setLimit(50)          // Change page size
filters.setSort('name')       // Change sort field
filters.setOrder('asc')       // Change sort direction
filters.setLocalSearchValue('query')  // Update local search input
filters.executeSearch()        // Execute search
```

---

## Authentication Flow

### Mock Mode (Testing)
When `VITE_USE_MOCK_AUTH=true`:
1. Login with `admin` / `admin123` → Mock token generated
2. Token stored in `localStorage` (Zustand persist)
3. No backend required — perfect for UI development and testing

### Production Mode
When `VITE_USE_MOCK_AUTH=false`:
1. Login → `POST /auth/sign-in` → Receive `access_token`
2. Token stored in `localStorage` (Zustand persist)
3. Axios interceptor auto-adds `Authorization: Bearer {token}` header
4. 401 response triggers auto-logout → Redirect to login page
5. `ProtectedRoute` blocks unauthenticated access to admin pages

---

## API Layer

All API calls go through the `apiService` in `src/lib/api.ts`:

```typescript
import { apiService } from '@/lib/api'

// Basic CRUD
await apiService.get('/endpoint', { page: 1, limit: 30 })
await apiService.post('/endpoint', { name: 'New Item' })
await apiService.patch('/endpoint/1', { name: 'Updated' })
await apiService.delete('/endpoint/1')

// Error handling wrapper
const result = await apiService.callWithErrorHandling(
  () => apiService.get('/endpoint'),
  'Failed to fetch data.'
)

if (result.success) {
  // result.response.data
} else {
  // result.finalMessage (error message)
}

// File upload
await apiService.upload('/upload', formData, (progress) => {
  console.log(`${progress}% complete`)
})
```

---

## Customization

### Theme Colors

Edit `src/styles/variables.css` to change the primary color palette:

```css
:root {
  --primary-500: #FF2C5A;   /* Main color - change to match your brand */
  --Stone-100: #EFEFEF;     /* Gray shades */
  --positive: #21ba45;      /* Success */
  --negative: #c10015;      /* Error */
  --info: #31ccec;          /* Info */
  --warning: #f2c037;       /* Warning */
}
```

### Fonts

The default font is **Inter** (loaded via Google Fonts). Change it in `index.html` and `src/globals.css`.

---

## Lexical Editor

Use the rich text editor in pages that need formatted content:

```tsx
import LexicalEditor from '@/components/editor/LexicalEditor'

<LexicalEditor
  onChange={(htmlContent) => handleChange('content', htmlContent)}
  initialContent={data?.content}
  imageUploadDirectory="notices/images"
/>
```

See `src/components/editor/README.md` for detailed usage.
