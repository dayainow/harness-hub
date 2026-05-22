// components/shared/BaseTable.tsx
import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import BaseButton from "@/components/common/BaseButton.tsx";
import ImageDialog from "@/components/common/ImageDialog.tsx";

export interface ButtonDef {
  label: string | ((row: any) => string)
  onClick?: (row: any) => void
  color?: 'red' | 'gray' | 'blue' | 'black' | 'negative' | 'white' | 'darkRed' | 'lightgray'| ((row: any) => 'red' | 'gray' | 'blue' | 'black' | 'negative' | 'white' | 'darkRed' | 'lightgray')
  variant?: 'solid' | 'outline' | ((row: any) => 'solid' | 'outline')
  width?: string | ((row: any) => string)
  height?: string | ((row: any) => string)
}

export interface ColumnDef {
  key: string
  label: string
  width?: string  // e.g.: "100px", "20%", "auto"
  type?: 'text' | 'image' | 'buttons' | 'custom' | 'textarea'  // Column type (default: text)
  align?: 'left' | 'center' | 'right'  // Text alignment (default: left)
  imageWidth?: string
  imageHeight?: string  // Image height (default: 50px)
  buttons?: ButtonDef[] | ((row: any) => ButtonDef[])  // Button array or function
  direction?: 'row' | 'column' | ((row: any) => 'row' | 'column')  // Button layout direction
  labelButton?: {  // Button to display next to the label
    label: string
    onClick: (row: any) => void
  }
  render?: (value: any, row: any) => React.ReactNode  // Custom render function
}

interface BaseTableProps {
  columns: ColumnDef[]
  data: any[]
  onRowClick?: (row: any) => void
}

export function BaseTable({ columns, data, onRowClick }: BaseTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleCellClick = (_e: React.MouseEvent, row: any, col: ColumnDef) => {
    // Do not propagate click events for button columns
    if (col.type === 'buttons') {
      return
    }
    onRowClick?.(row)
  }

  const renderCell = (col: ColumnDef, value: any, row: any) => {
    // Use custom render function if provided
    if (col.render) {
      return col.render(value, row)
    }

    if (col.type === 'textarea') {
      return (
        <div style={{ whiteSpace: 'pre-line' }}>
          {value || '-'}
        </div>
      )
    }

    if (col.type === 'image') {
      // Don't render image if value is empty
      if (!value) {
        return '-'
      }

      return (
        <img
          src={value}
          alt={col.label}
          style={{ width: col.imageWidth, height: col.imageHeight || '50px', objectFit: 'cover' }}
          className="rounded cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedImage(value)
          }}
        />
      )
    }

    if (col.type === 'buttons' && col.buttons) {
      // If buttons is a function, execute it to get the array
      const buttonList = typeof col.buttons === 'function' ? col.buttons(row) : col.buttons

      // If direction is a function, execute it to get the value
      const direction = typeof col.direction === 'function' ? col.direction(row) : (col.direction || 'row')
      const flexClass = direction === 'column' ? 'flex-col' : 'flex-row'

      return (
        <div className={`flex ${flexClass} gap-2`}>
          {buttonList.map((btn, idx) => {
            // Execute each button property if it is a function
            const label = typeof btn.label === 'function' ? btn.label(row) : btn.label
            const color = typeof btn.color === 'function' ? btn.color(row) : (btn.color || 'white')
            const variant = typeof btn.variant === 'function' ? btn.variant(row) : (btn.variant || 'solid')
            const width = typeof btn.width === 'function' ? btn.width(row) : (btn.width || 'auto')
            const height = typeof btn.height === 'function' ? btn.height(row) : (btn.height || '32px')

            return (
              <BaseButton
                key={idx}
                label={label}
                onClick={btn.onClick ? () => btn.onClick!(row) : undefined}
                color={color}
                variant={variant}
                width={width}
                height={height}
              />
            )
          })}
        </div>
      )
    }

    // If labelButton exists, display value and button together
    if (col.labelButton) {
      return (
        <div className="flex items-center justify-between">
          <span>{value}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              col.labelButton!.onClick(row)
            }}
            className="ml-2 px-2 py-1 text-xs text-[var(--blue)] bg-white border border-[var(--blue)] rounded hover:bg-[var(--Stone-50)] transition-colors"
          >
            {col.labelButton.label}
          </button>
        </div>
      )
    }

    return value
  }

  return (
    <div style={{maxWidth:"100%", marginBottom:"40px"}}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead
                key={col.key}
                style={{ width: col.width, padding: '10px 12px', textAlign: col.align || 'left' }}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={i}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                style={{
                  backgroundColor: row._isSelected ? 'var(--blue-50, #EFF6FF)' : undefined
                }}
              >
                {columns.map(col => (
                  <TableCell
                    key={col.key}
                    style={{ width: col.width, padding: '10px 12px', textAlign: col.align || 'left' }}
                    onClick={(e) => handleCellClick(e, row, col)}
                  >
                    {renderCell(col, row[col.key], row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ImageDialog
        open={!!selectedImage}
        image={selectedImage || ''}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      />
    </div>
  )
}