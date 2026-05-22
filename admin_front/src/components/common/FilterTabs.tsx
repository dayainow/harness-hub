import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown } from "lucide-react";

export interface FilterTab {
  value: string
  label: string
  params?: Record<string, any>  // API에 전달할 파라미터
  sortValue?: string  // 정렬 필드 값 (예: 'createdAt', 'name' 등)
}

export type SortOrder = 'asc' | 'desc';

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
  // 정렬 순서 관련
  showSortOrder?: boolean
  sortOrder?: SortOrder
  onSortOrderChange?: (order: SortOrder) => void
}

export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  showSortOrder = false,
  sortOrder = 'desc',
  onSortOrderChange
}: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
        <TabsList style={{fontSize: "12px"}}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {showSortOrder && onSortOrderChange && (
        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="px-2 py-1   transition-colors flex items-center gap-1 bg-white text-gray-600  hover:border-gray-400"
          style={{ height: '28px', fontSize: '12px' }}
        >
          <span style={{fontSize:'12px'}}>{sortOrder === 'asc' ? '오름차순' : '내림차순'}</span>
          {sortOrder === 'asc' ? <ArrowUpDown size={12} /> : <ArrowUpDown size={12} />}
        </button>
      )}
    </div>
  )
}