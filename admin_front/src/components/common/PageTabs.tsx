import { Tabs, TabsList, TabsTrigger } from "@/components/ui/pagetabs";

export interface PageTab {
  value: string
  label: string
  sortValue?: string  // 정렬 필드 값 (예: 'createdAt', 'name' 등)
}

export type SortOrder = 'asc' | 'desc';

interface PageTabsProps {
  tabs: PageTab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
  triggerClassName?: string  // TabsTrigger에 적용할 className
  // 정렬 순서 관련
}

export function PageTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  triggerClassName,
}: PageTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
        <TabsList >
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className={triggerClassName}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}