import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

interface CategoryCount {
  category: string;
  count: number;
}

const columnHelper = createColumnHelper<CategoryCount>();

function useCategoryCounts() {
  return useQuery({
    queryKey: ['categories', 'product-counts'],
    queryFn: async () => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.get('/products/categories'),
        '카테고리 통계를 가져오는데 실패했습니다.'
      );
      if (!res.success) throw new Error('Failed to fetch categories');
      const data = (res as any).response?.data?.data || (res as any).response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  'Generative Art': 'from-pink-500 to-rose-500',
  'LLMs': 'from-indigo-500 to-blue-500',
  'Audio AI': 'from-violet-500 to-purple-500',
  'Video AI': 'from-red-500 to-orange-500',
  'Code AI': 'from-emerald-500 to-teal-500',
  'Productivity': 'from-sky-500 to-cyan-500',
  'Data & Analytics': 'from-amber-500 to-yellow-500',
};

export default function CategoriesListPage() {
  const { data: categories, isLoading } = useCategoryCounts();

  const columns = [
    columnHelper.accessor('category', {
      header: '카테고리',
      cell: (info) => {
        const name = info.getValue();
        const gradient = CATEGORY_COLORS[name] || 'from-slate-500 to-slate-600';
        return (
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
            <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('count', {
      header: '등록된 도구 수',
      cell: (info) => {
        const count = info.getValue();
        const maxCount = Math.max(...(categories || []).map((c: CategoryCount) => c.count), 1);
        const widthPercent = (count / maxCount) * 100;
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-[32px] text-right">{count}</span>
          </div>
        );
      }
    }),
  ];

  const table = useReactTable({
    data: categories || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent pb-1">
            카테고리 관리
          </h1>
          <p className="text-slate-500 font-medium mt-1">AI 도구 카테고리별 등록 현황을 모니터링합니다.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">데이터를 불러오는 중입니다...</td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">등록된 카테고리가 없습니다.</td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
