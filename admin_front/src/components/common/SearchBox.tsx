import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon,Search } from "lucide-react"

export interface SearchOption {
  value: string
  label: string
}

interface SearchBoxProps {
  options?: SearchOption[]
  selectedOption?: string
  onOptionChange?: (value: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearch?: () => void
  placeholder?: string
  buttonLabel?: string
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  showDateRange?: boolean
  minDate?: string
  maxDate?: string
  onDateRangeChange?: (minDate: string, maxDate: string) => void
}

export function SearchBox({
                            options = [],
                            selectedOption: controlledSelectedOption,
                            onOptionChange,
                            searchValue: controlledSearchValue,
                            onSearchChange,
                            onSearch,
                            placeholder = "Enter a search term",
                            buttonLabel = "Search",
                            className,
                            onKeyDown,
                            showDateRange = false,
                            minDate: controlledMinDate,
                            maxDate: controlledMaxDate,
                            onDateRangeChange,
                          }: SearchBoxProps) {
  // Internal state (used when controlled props are not provided)
  const [internalSelectedOption, setInternalSelectedOption] = useState(options[0]?.value || "")
  const [internalSearchValue, setInternalSearchValue] = useState("")
  const [internalMinDate, setInternalMinDate] = useState("")
  const [internalMaxDate, setInternalMaxDate] = useState("")

  // Determine controlled vs uncontrolled
  const selectedOption = controlledSelectedOption !== undefined ? controlledSelectedOption : internalSelectedOption
  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue
  const minDate = controlledMinDate !== undefined ? controlledMinDate : internalMinDate
  const maxDate = controlledMaxDate !== undefined ? controlledMaxDate : internalMaxDate

  const selectedLabel = options.find(opt => opt.value === selectedOption)?.label || options[0]?.label

  const handleOptionChange = (value: string) => {
    if (onOptionChange) {
      onOptionChange(value)
    } else {
      setInternalSelectedOption(value)
    }
  }

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value)
    } else {
      setInternalSearchValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.()
    }
  }

  const handleMinDateChange = (value: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(value, maxDate)
    } else {
      setInternalMinDate(value)
    }
  }

  const handleMaxDateChange = (value: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(minDate, value)
    } else {
      setInternalMaxDate(value)
    }
  }

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      {showDateRange && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={minDate}
            onChange={(e) => handleMinDateChange(e.target.value)}
            className="flex-1"
            style={{height:"35px", width: "150px"}}
          />
          <span>-</span>
          <Input
            type="date"
            value={maxDate}
            onChange={(e) => handleMaxDateChange(e.target.value)}
            className="flex-1"
            style={{height:"35px", width: "150px"}}
          />
        </div>
      )}
      {options.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild style={{border:"1px solid var(--Stone-200)", height:"35px"}}>
            <Button variant="outline" className="min-w-[120px] justify-between">
              {selectedLabel}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {options.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleOptionChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Input
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        onKeyDown={onKeyDown || handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
        style={{height:"35px"}}
      />

      <Button
        onClick={onSearch}
        type="button"
        style={{cursor: "pointer" , backgroundColor: "black", color: "white", width: "80px", height: "35px"}}
        className="gap-2"
      >
        <span>{buttonLabel}</span>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  )
}