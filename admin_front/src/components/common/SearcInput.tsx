import { useState } from "react"
import {  Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ChevronDownIcon } from "lucide-react"

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
}

export function SearchInput({
                            options = [],
                            selectedOption: controlledSelectedOption,
                            onOptionChange,
                            searchValue: controlledSearchValue,
                            onSearchChange,
                            onSearch,

                            className
                          }: SearchBoxProps) {
  // Internal state (used when controlled props are not provided)
  const [internalSelectedOption, setInternalSelectedOption] = useState(options[0]?.value || "")
  const [internalSearchValue, setInternalSearchValue] = useState("")

  // Determine controlled vs uncontrolled
  const selectedOption = controlledSelectedOption !== undefined ? controlledSelectedOption : internalSelectedOption
  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue

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
      e.preventDefault()  // Prevent form submission
      e.stopPropagation()  // Prevent event propagation
      onSearch?.()
    }
  }

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      {options.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild style={{border:"1px solid var(--Stone-200)", height:"35px"}}>
            <Button type="button" variant="outline" className="min-w-[120px] justify-between">
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
      <div className="grid w-full max-w-sm gap-6">
        <InputGroup style={{border:"1px solid var(--Stone-200)", height:"38px"}}>
          <InputGroupInput
            type="text"
            placeholder="Enter a search term"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}