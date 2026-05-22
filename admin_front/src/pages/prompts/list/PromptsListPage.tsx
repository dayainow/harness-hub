import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { usePromptsList, useDeletePrompt } from '@/hooks/queries/useUgc';
import { Prompt } from '@/models/ugc';
import { toast } from 'sonner';
import { ContentDetailModal } from '@/components/common/ContentDetailModal';

const columnHelper = createColumnHelper<Prompt>();

export default function PromptsListPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const { data: prompts, isLoading } = usePromptsList();
  const { mutate: deletePrompt, isPending } = useDeletePrompt();

  const handleDelete = (id: string) => {
    if (!window.confirm('정말 이 프롬프트를 삭제하시겠습니까? 복구할 수 없습니다.')) return;
    deletePrompt(id, {
      onSuccess: () => toast.success('성공적으로 삭제되었습니다.'),
      onError: (err: any) => toast.error('삭제 실패: ' + err.message)
    });
  };

  const columns = [
    columnHelper.accessor('title', {
      header: '제목 (미리보기)',
      cell: (info) => {
        const row = info.row.original;
        return (
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              {info.getValue()}
              {row.isFlagged && (
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded" title={row.flagReason || '차단됨'}>
                  차단됨
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500 overflow-hidden text-ellipsis line-clamp-1 max-w-[300px] mt-1">
              {info.row.original.content}
            </p>
          </div>
        );
      }
    }),
    columnHelper.accessor('toolName', {
      header: '관련 도구',
      cell: (info) => (
        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium">
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('category', {
      header: '카테고리',
      cell: (info) => (
        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium">
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('author', {
      header: '작성자',
      cell: (info) => {
        const author = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              {author?.avatarUrl ? <img src={author.avatarUrl} alt="avatar" /> : <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-indigo-500" />}
            </div>
            <span className="text-sm font-medium">{author?.name || '익명'}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('likes', {
      header: '반응',
      cell: (info) => (
        <div className="flex gap-3 text-xs text-slate-500">
          <span title="추천수">❤️ {info.getValue()}</span>
          <span title="조회수">👁️ {info.row.original.views}</span>
        </div>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: '등록일',
      cell: (info) => <span className="text-sm text-slate-500">{new Date(info.getValue()).toLocaleDateString()}</span>
    }),
    columnHelper.display({
      id: 'actions',
      header: '관리',
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPrompt(row)}
              className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              보기
            </button>
            <button
              disabled={isPending}
              onClick={() => handleDelete(row.id)}
              className="px-3 py-1 text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 rounded-lg transition-colors disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        );
      }
    }),
  ];

  const table = useReactTable({
    data: prompts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent pb-1">
            프롬프트 관리
          </h1>
          <p className="text-slate-500 font-medium mt-1">유저가 공유한 프롬프트 콘텐츠를 조회하고 모니터링합니다.</p>
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
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">등록된 프롬프트가 없습니다.</td>
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

      {selectedPrompt && (
        <ContentDetailModal
          isOpen={!!selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          title={selectedPrompt.title}
          category={`${selectedPrompt.category} • ${selectedPrompt.toolName}`}
          content={selectedPrompt.content}
        />
      )}
    </div>
  );
}
