// components/common/DialogTable.tsx
import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import BaseButton from "@/components/common/BaseButton.tsx"
import ImageDialog from "@/components/common/ImageDialog.tsx"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface ButtonDef {
  label: string | ((row: any) => string)
  onClick: (row: any) => void
  color?: 'red' | 'gray' | 'blue' | 'black' | 'negative' | 'white' | 'darkRed' | ((row: any) => 'red' | 'gray' | 'blue' | 'black' | 'negative' | 'white' | 'darkRed')
  variant?: 'solid' | 'outline' | ((row: any) => 'solid' | 'outline')
  width?: string | ((row: any) => string)
  height?: string | ((row: any) => string)
}

export interface SelectOption {
  value: string
  label: string
}

export interface ColumnDef {
  key: string
  label: string
  width?: string
  type?: 'text' | 'image' | 'buttons' | 'input' | 'select' | 'custom'
  editable?: boolean  // 수정 가능 여부
  imageWidth?: string
  imageHeight?: string
  buttons?: ButtonDef[] | ((row: any) => ButtonDef[])
  direction?: 'row' | 'column' | ((row: any) => 'row' | 'column')
  selectOptions?: SelectOption[]  // select 타입일 때 옵션
  inputType?: 'text' | 'number' | 'date' | 'datetime-local'  // input 타입
  render?: (value: any, row: any) => React.ReactNode  // custom 렌더링 함수
}

interface DialogTableProps {
  columns: ColumnDef[]
  data: any[]
  onRowClick?: (row: any) => void
  onChange?: (rowIndex: number, key: string, value: any) => void  // 셀 값 변경 콜백
  selectedRow?: any  // 선택된 row
  rowKeyField?: string  // row 식별자 필드 (기본값: 'no')
}

export function DialogTable({ columns, data, onRowClick, onChange, selectedRow, rowKeyField = 'no' }: DialogTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleCellClick = (_e: React.MouseEvent, row: any, col: ColumnDef) => {
    // 버튼 컬럼은 클릭 이벤트를 전파하지 않음
    if (col.type === 'buttons') {
      return
    }
    onRowClick?.(row)
  }

  const handleCellChange = (rowIndex: number, key: string, value: any) => {
    onChange?.(rowIndex, key, value)
  }

  const renderCell = (col: ColumnDef, value: any, row: any, rowIndex: number) => {
    // Custom 렌더링 타입
    if (col.type === 'custom' && col.render) {
      return col.render(value, row)
    }

    // 이미지 타입
    if (col.type === 'image') {
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

    // 버튼 타입
    if (col.type === 'buttons' && col.buttons) {
      const buttonList = typeof col.buttons === 'function' ? col.buttons(row) : col.buttons
      const direction = typeof col.direction === 'function' ? col.direction(row) : (col.direction || 'row')
      const flexClass = direction === 'column' ? 'flex-col' : 'flex-row'

      return (
        <div className={`flex ${flexClass} gap-2`}>
          {buttonList.map((btn, idx) => {
            const label = typeof btn.label === 'function' ? btn.label(row) : btn.label
            const color = typeof btn.color === 'function' ? btn.color(row) : (btn.color || 'white')
            const variant = typeof btn.variant === 'function' ? btn.variant(row) : (btn.variant || 'solid')
            const width = typeof btn.width === 'function' ? btn.width(row) : (btn.width || 'auto')
            const height = typeof btn.height === 'function' ? btn.height(row) : (btn.height || '32px')

            return (
              <BaseButton
                key={idx}
                label={label}
                onClick={() => btn.onClick(row)}
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

    // Row별 Select 타입 우선 확인 (row에 type, selectOptions가 있는 경우)
    if (row.type === 'select' && row.selectOptions && col.editable) {
      return (
        <Select
          value={value?.toString() || ''}
          onValueChange={(newValue) => handleCellChange(rowIndex, col.key, newValue)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {row.selectOptions.map((option: SelectOption) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    // Column의 Select 타입
    if (col.type === 'select' && col.editable && col.selectOptions) {
      return (
        <Select
          value={value?.toString() || ''}
          onValueChange={(newValue) => handleCellChange(rowIndex, col.key, newValue)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {col.selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    // Input 타입 (editable이 true인 경우)
    if ((col.type === 'input' || col.editable) && col.type !== 'select' && row.type !== 'select') {
      const inputType = row.inputType || col.inputType || 'text'
      return (
        <Input
          type={inputType}
          value={value || ''}
          onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
          className="w-full"
          onClick={(e) => e.stopPropagation()}
        />
      )
    }

    // 기본 텍스트
    return value
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead
                key={col.key}
                style={{ width: col.width, padding: '10px 12px' }}
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
                데이터가 없습니다
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => {
              const isSelected = selectedRow && selectedRow[rowKeyField] === row[rowKeyField];
              return (
                <TableRow
                  key={i}
                  className={`${onRowClick ? "cursor-pointer" : ""} ${isSelected ? "" : "hover:bg-gray-50"}`}
                  style={{
                    backgroundColor: isSelected ? 'var(--Slate-200)' : undefined,
                  }}
                >
                  {columns.map(col => (
                    <TableCell
                      key={col.key}
                      style={{ width: col.width, padding: '10px 12px' }}
                      onClick={(e) => handleCellClick(e, row, col)}
                    >
                      {renderCell(col, row[col.key], row, i)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
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