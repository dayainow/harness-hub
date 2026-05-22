import {FormEvent, useState, useEffect} from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import BaseButton from '@/components/common/BaseButton.tsx'
import {SearchInput} from "@/components/common/SearcInput.tsx"
import {toast} from "sonner"
import {BaseTable, ColumnDef} from "@/components/common/BaseTable.tsx"
import {BasePagination} from "@/components/common/Pagination.tsx"

interface SelectDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect?: (item: T) => void  // Returns an item of type T
  onCancel?: () => void
  showCloseButton?: boolean
  title?: string
  columns?: ColumnDef[]
  enableSearch?: boolean

  // Core: receives fetchData as props
  fetchData: (params: any) => Promise<{ data?: { items: T[]; total: number }; items?: T[]; total?: number }>

  // Data formatting function (optional)
  formatItem?: (item: T) => any

  // Function to display the selected item
  getItemLabel?: (item: T) => string

  // Function to extract item ID
  getItemId?: (item: T) => string | number

  // Default search option
  defaultSearchOption?: string
}

// Generic Component
// Adding <T> allows this component to accept any type
export default function SelectDialog<T>({
  open,
  onOpenChange,
  onSelect,
  onCancel,
  showCloseButton = true,
  title = "Select Item",
  columns,
  enableSearch = true,
  fetchData,
  formatItem,
  getItemLabel,
  getItemId = (item: any) => item.id,  // Default: uses the id field
  defaultSearchOption = "name"
}: SelectDialogProps<T>) {

  // Using Generic type
  const [list, setList] = useState<T[]>([])
  const [selected, setSelected] = useState<T | null>(null)

  const [searchOption, setSearchOption] = useState(defaultSearchOption)
  const [searchValue, setSearchValue] = useState("")
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)

  // Reset whenever the dialog opens
  useEffect(() => {
    if (open) {
      setSelected(null)
      setCurrentPage(1)
      setList([])
      setTotal(0)

      // If enableSearch is false, call the API immediately when the dialog opens
      if (!enableSearch) {
        fetchItems()
      }
    }
  }, [open])

  const fetchItems = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchValue && {
          search: searchValue,
          searchKey: searchOption,
        }),
      }

      const response = await fetchData(params)

      // Supports both response formats: { data: { items, total } } or { items, total }
      const items = 'data' in response ? response.data?.items : response.items
      const total = 'data' in response ? response.data?.total : response.total

      // Apply formatting if formatItem is provided
      const formattedItems = formatItem
        ? (items || []).map(formatItem)
        : (items || [])

      setList(formattedItems as T[])
      setTotal(Number(total) || 0)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch data.')
    }
  }

  // Search handler
  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast.error('Please enter a search term.')
      return
    }
    setCurrentPage(1)
    fetchItems()
  }

  // Call API when page changes
  useEffect(() => {
    if (open && (list.length > 0 || !enableSearch)) {
      fetchItems()
    }
  }, [currentPage, itemsPerPage])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selected) {
      toast.error('Please select an item.')
      return
    }

    onSelect?.(selected)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleRowClick = (row: T) => {
    setSelected(row)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  // Selected item label (falls back to default behavior if getItemLabel is not provided)
  const selectedLabel = selected && getItemLabel
    ? getItemLabel(selected)
    : selected
      ? String((selected as any).name || (selected as any).title || 'Selected')
      : 'Please select an item'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className="bg-white border-0"
        style={{ maxWidth: '900px', maxHeight: '800px'}}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle style={{fontSize:"16px", fontWeight:"500"}}>
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4" style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
            {/* Search - only displayed when enableSearch is true */}
            {enableSearch && (
              <div>
                <SearchInput
                  selectedOption={searchOption}
                  onOptionChange={setSearchOption}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  onSearch={handleSearch}
                />
              </div>
            )}

            {/* List table */}
            {(!enableSearch || list.length > 0) && (
              <>
                <div style={{ maxHeight:"400px", overflowX: 'auto' }}>
                  <div style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--Stone-600)' }}>
                    {selectedLabel}
                  </div>
                  {columns && (
                    <BaseTable
                      columns={columns}
                      data={list.map((item, index) => ({
                        ...item,
                        rowNumber: total - ((currentPage - 1) * itemsPerPage + index),
                        _isSelected: selected !== null && getItemId(selected) === getItemId(item)
                      }))}
                      onRowClick={handleRowClick}
                    />
                  )}
                </div>

                {/* Pagination */}
                <BasePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </>
            )}
          </div>

          <DialogFooter className="flex" style={{ gap: '36px'}}>
            <BaseButton
              type="button"
              label="Cancel"
              color="black"
              onClick={handleCancel}
              width="60px"
            />
            <BaseButton
              type="submit"
              label="Confirm"
              color="blue"
              width="108px"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}