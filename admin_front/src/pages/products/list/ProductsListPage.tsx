import { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { useToolsList, usePendingTools, useApproveTool, useRejectTool } from '@/hooks/queries/useTools';
import { Product } from '@/models/product';

const columnHelper = createColumnHelper<Product>();

export default function ToolsListPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING'>('ALL');

  // Queries
  const { data: allTools, isLoading: isAllLoading } = useToolsList();
  const { data: pendingTools, isLoading: isPendingLoading } = usePendingTools();

  // Mutations
  const { mutate: approve, isPending: isApproving } = useApproveTool();
  const { mutate: reject, isPending: isRejecting } = useRejectTool();

  const handleApprove = (id: string, name: string) => {
    if (!window.confirm(`'${name}' 도구를 승인하시겠습니까?`)) return;
    approve(id, {
      onSuccess: () => toast.success('도구가 정상적으로 승인되었습니다.'),
      onError: (err: any) => toast.error('승인 실패: ' + err.message)
    });
  };

  const handleReject = (id: string, name: string) => {
    if (!window.confirm(`'${name}' 도구를 반려하시겠습니까? 반려 시 재승인이 필요합니다.`)) return;
    reject(id, {
      onSuccess: () => toast.success('도구가 반려되었습니다.'),
      onError: (err: any) => toast.error('반려 실패: ' + err.message)
    });
  };

  // Columns definition
  const columns = [
    columnHelper.accessor('name', {
      header: '도구명',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            {info.row.original.iconUrl ? (
              <img src={info.row.original.iconUrl} alt="icon" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">🤖</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{info.getValue()}</p>
            <p className="text-xs text-slate-500 max-w-[200px] truncate">{info.row.original.shortDesc}</p>
          </div>
        </div>
      )
    }),
    columnHelper.accessor('category', {
      header: '카테고리',
      cell: (info) => (
        <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-medium">
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('status', {
      header: '상태',
      cell: (info) => {
        const status = info.getValue();
        const color = status === 'ACTIVE' 
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
          : status === 'PENDING'
          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        return <span className={`px-2 py-1 rounded-md text-xs font-bold ${color}`}>{status}</span>;
      }
    }),
    columnHelper.accessor('pricingModel', {
      header: '요금제',
      cell: (info) => <span className="text-sm font-medium">{info.getValue() || '-'}</span>
    }),
    columnHelper.accessor('createdAt', {
      header: '등록일',
      cell: (info) => <span className="text-sm text-slate-500">{new Date(info.getValue()).toLocaleDateString()}</span>
    }),
    columnHelper.display({
      id: 'actions',
      header: '액션',
      cell: (info) => {
        const { id, name, status } = info.row.original;
        const processing = isApproving || isRejecting;
        return (
          <div className="flex items-center gap-2">
            <button
              disabled={processing || status === 'ACTIVE'}
              onClick={() => handleApprove(id, name)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
            >
              승인
            </button>
            <button
              disabled={processing || status === 'PENDING'}
              onClick={() => handleReject(id, name)}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
            >
              반려
            </button>
          </div>
        );
      }
    })
  ];

  const data = activeTab === 'ALL' ? (allTools || []) : (pendingTools || []);
  const isLoading = activeTab === 'ALL' ? isAllLoading : isPendingLoading;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent pb-1">
            AI 도구 관리
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            플랫폼에 노출되는 모든 AI 도구를 관리하고 승인 대기중인 제보들을 처리합니다.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'ALL'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          전체 도구 목록
        </button>
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          승인 대기중
          {pendingTools && pendingTools.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingTools.length}
            </span>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    조회된 데이터가 없습니다.
                  </td>
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
