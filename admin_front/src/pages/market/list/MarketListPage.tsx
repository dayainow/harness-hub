import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useLabsList, useDeleteLab } from '@/hooks/queries/useUgc';
import { Lab } from '@/models/ugc';
import { toast } from 'sonner';
import { ContentDetailModal } from '@/components/common/ContentDetailModal';

const columnHelper = createColumnHelper<Lab>();

export default function LabsListPage() {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const { data: market, isLoading } = useLabsList();
  const { mutate: deleteLab, isPending } = useDeleteLab();

  const handleDelete = (id: string) => {
    if (!window.confirm('정말 이 실험실 콘텐츠를 삭제하시겠습니까? 복구할 수 없습니다.')) return;
    deleteLab(id, {
      onSuccess: () => toast.success('성공적으로 삭제되었습니다.'),
      onError: (err: any) => toast.error('삭제 실패: ' + err.message)
    });
  };

  const columns = [
    columnHelper.accessor('title', {
      header: '실험 명 (타이틀)',
      cell: (info) => {
        const { emoji, description } = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
              {emoji || '🔬'}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                {info.getValue()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('category', {
      header: '주제/스택',
      cell: (info) => {
        const { stack } = info.row.original;
        return (
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              {info.getValue()}
            </span>
            {stack && stack.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {stack.map((s, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor('difficulty', {
      header: '난이도',
      cell: (info) => {
        const val = info.getValue() || '보통';
        const isHard = val === '고급';
        const isEasy = val === '입문';
        return (
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
            isHard ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
            : isEasy ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
          }`}>
            {val}
          </span>
        )
      }
    }),
    columnHelper.accessor('metric', {
      header: '핵심 지표 (Metric)',
      cell: (info) => <span className="text-sm font-semibold">{info.getValue() || '-'}</span>
    }),
    columnHelper.accessor('likes', {
      header: '반응',
      cell: (info) => <span className="text-sm">🔥 {info.getValue()}</span>
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
              onClick={() => setSelectedLab(row)}
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
    data: market || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent pb-1">
            AI 실험실 관리
          </h1>
          <p className="text-slate-500 font-medium mt-1">전문가들이 운영하는 AI 실험실(Market) 콘텐츠 리스트를 확인합니다.</p>
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
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">등록된 실험이 없습니다.</td>
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

      {selectedLab && (
        <ContentDetailModal
          isOpen={!!selectedLab}
          onClose={() => setSelectedLab(null)}
          title={`${selectedLab.emoji || '🧪'} ${selectedLab.title}`}
          category={`${selectedLab.category} • ${selectedLab.difficulty}`}
          content={selectedLab.description + (selectedLab.content ? `\n\n${selectedLab.content}` : '')}
        />
      )}
    </div>
  );
}
