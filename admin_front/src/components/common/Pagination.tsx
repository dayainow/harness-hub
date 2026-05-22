import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronFirst, ChevronLast } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface BasePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onItemsPerPageChange: (itemsPerPage: number) => void
  maxVisiblePages?: number
}

export function BasePagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  maxVisiblePages = 10
}: BasePaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is within the max visible count
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // When total pages exceeds the max visible count
      const halfVisible = Math.floor(maxVisiblePages / 2)

      if (currentPage <= halfVisible) {
        // When current page is near the beginning (e.g., 1 2 3 4 5 6 7 8 9 ... 50)
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis-end')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - halfVisible) {
        // When current page is near the end (e.g., 1 ... 42 43 44 45 46 47 48 49 50)
        pages.push(1)
        pages.push('ellipsis-start')
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // When current page is in the middle (e.g., 1 ... 24 25 26 27 28 ... 50)
        pages.push(1)
        pages.push('ellipsis-start')

        const start = currentPage - Math.floor((maxVisiblePages - 4) / 2)
        const end = currentPage + Math.ceil((maxVisiblePages - 4) / 2)

        for (let i = start; i <= end; i++) {
          pages.push(i)
        }

        pages.push('ellipsis-end')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const pageNumbers = getPageNumbers()

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[80px] border-[color:var(--Stone-200)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[color:var(--Stone-200)] bg-white">
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          {/* Go to first page */}
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageClick(1)}
              className="cursor-pointer"
              aria-disabled={currentPage === 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Previous page */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageClick(currentPage - 1)}
              className="cursor-pointer"
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <PaginationItem key={`page-${index}`}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageClick(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* 다음 페이지 */}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageClick(currentPage + 1)}
              className="cursor-pointer"
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>

          {/* 맨 뒤로 */}
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageClick(totalPages)}
              className="cursor-pointer"
              aria-disabled={currentPage === totalPages}
            >
              <ChevronLast className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
