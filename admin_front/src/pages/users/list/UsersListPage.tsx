import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { USER_API } from '@/constants/api-paths';

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN' | 'CREATOR';
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    prompts: number;
    experiments: number;
  };
}

const columnHelper = createColumnHelper<User>();

function useUsersList() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.get(USER_API.PREFIX),
        '사용자 목록을 가져오는데 실패했습니다.'
      );
      if (!res.success) throw new Error('Failed to fetch users');
      const responseData = (res as any).response?.data || (res as any).data;
      return Array.isArray(responseData) ? responseData : (responseData?.data || []);
    },
  });
}

function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.patch(`${USER_API.PREFIX}/${id}/role`, { role }),
        '권한 변경에 실패했습니다.'
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('사용자 권한이 성공적으로 변경되었습니다.');
    },
    onError: (err: any) => {
      toast.error('권한 변경 실패: ' + err.message);
    }
  });
}

export default function UsersListPage() {
  const { data: users, isLoading } = useUsersList();
  const { mutate: updateRole, isPending } = useUpdateRole();

  const columns = [
    columnHelper.accessor('username', {
      header: '사용자',
      cell: (info) => {
        const { name, avatarUrl, email } = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {(name || info.getValue())?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white leading-tight">{name || info.getValue()}</p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('role', {
      header: '역할',
      cell: (info) => {
        const role = info.getValue();
        const color =
          role === 'ADMIN'
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
            : role === 'CREATOR'
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        return <span className={`px-2 py-1 rounded-md text-xs font-bold ${color}`}>{role}</span>;
      }
    }),
    columnHelper.accessor('_count', {
      header: '활동',
      cell: (info) => {
        const count = info.getValue();
        if (!count) return <span className="text-sm text-slate-400">-</span>;
        return (
          <div className="flex gap-3 text-xs text-slate-500">
            <span title="게시글">📝 {count.posts ?? 0}</span>
            <span title="프롬프트">💬 {count.prompts ?? 0}</span>
            <span title="실험">🧪 {count.experiments ?? 0}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('createdAt', {
      header: '가입일',
      cell: (info) => <span className="text-sm text-slate-500">{new Date(info.getValue()).toLocaleDateString()}</span>
    }),
    columnHelper.display({
      id: 'actions',
      header: '권한 설정',
      cell: (info) => {
        const { id, role } = info.row.original;
        return (
          <select
            value={role}
            disabled={isPending}
            onChange={(e) => {
              if (window.confirm(`이 사용자의 권한을 ${e.target.value}(으)로 변경하시겠습니까?`)) {
                updateRole({ id, role: e.target.value });
              }
            }}
            className="px-2 py-1 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="USER">USER</option>
            <option value="CREATOR">CREATOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        );
      }
    }),
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent pb-1">
            사용자 관리
          </h1>
          <p className="text-slate-500 font-medium mt-1">플랫폼에 가입한 모든 사용자를 조회하고 역할별로 확인합니다.</p>
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
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">등록된 사용자가 없습니다.</td>
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
