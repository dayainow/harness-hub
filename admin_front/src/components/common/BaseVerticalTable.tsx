// components/common/BaseVerticalTable.tsx
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface VerticalRowDef {
  label: string
  key: string
  value?: any
  type?: 'text' | 'number' | 'textarea' | 'image' | 'file' | 'date' | 'datetime' | 'toggle' | 'custom'
  required?: boolean
  placeholder?: string
  disabled?: boolean
  editable?: boolean  // Whether editing is allowed (default: true)
  hourOnly?: boolean  // For datetime type, allow only hour selection (minutes/seconds fixed to 00)
  toggleOptions?: { label: string; value: any }[]  // Toggle options
  format?: (value: any) => string  // Value formatting function (used only in view mode)
  render?: (value: any, mode: 'view' | 'edit' | 'create') => React.ReactNode
  minDate?: string  // Minimum selectable date for date type (YYYY-MM-DD format, 'today' string allowed, '' = no limit)
  maxDate?: string  // Maximum selectable date for date type (YYYY-MM-DD format, 'today' string allowed)
}

interface BaseVerticalTableProps {
  rows: VerticalRowDef[]
  mode?: 'view' | 'edit' | 'create'  // Detail view, edit, create
  labelWidth?: string
  data?: Record<string, any>  // Existing data for edit mode
  onChange?: (key: string, value: any) => void  // Value change callback
}

export function BaseVerticalTable({
  rows,
  mode = 'view',
  labelWidth = "200px",
  data = {},
  onChange
}: BaseVerticalTableProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (mode === 'create') {
      const initialData = { ...data }
      rows.forEach(row => {
        if (row.type === 'toggle' && row.toggleOptions && initialData[row.key] === undefined) {
          initialData[row.key] = row.toggleOptions[0]?.value
        }
      })
      return initialData
    }
    return data
  })

  // Pass toggle default values to parent on component mount
  useEffect(() => {
    if (mode === 'create') {
      rows.forEach(row => {
        if (row.type === 'toggle' && row.toggleOptions) {
          onChange?.(row.key, formData[row.key] ?? row.toggleOptions[0]?.value)
        }
      })
    }
  }, [])

  // Update formData when mode changes or data is changed externally
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData(data)
    }
  }, [mode, data])

  const handleChange = (key: string, newValue: any) => {
    setFormData(prev => ({ ...prev, [key]: newValue }))
    onChange?.(key, newValue)
  }

  const renderValue = (row: VerticalRowDef) => {
    const value = formData[row.key] ?? data[row.key] ?? row.value
    const isEditable = row.editable !== false  // Default true

    // Use custom render function if provided
    if (row.render) {
      return row.render(value, mode)
    }

    // View mode
    if (mode === 'view') {
      if (row.type === 'image') {
        return <img src={value} alt={row.label} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />
      }
      if (row.type === 'toggle' && row.toggleOptions) {
        const option = row.toggleOptions.find(opt => opt.value === value)
        const displayValue = option?.label || (row.format ? row.format(value) : value) || '-'
        return <span>{displayValue}</span>
      }
      if (row.type === 'date') {
        return <span>{value ? new Date(value).toLocaleDateString('en-US') : '-'}</span>
      }
      if (row.type === 'textarea') {
        return <span style={{ whiteSpace: 'pre-wrap' }}>{value ?? '-'}</span>
      }
      return <span>{value ?? '-'}</span>
    }

    // Edit/Create mode
    if (mode === 'edit' || mode === 'create') {
      // If editable is false, render in view mode
      if (!isEditable) {
        if (row.type === 'image') {
          return <img src={value} alt={row.label} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />
        }
        if (row.type === 'toggle' && row.toggleOptions) {
          const option = row.toggleOptions.find(opt => opt.value === value)
          return <span>{option?.label ?? (value ?? '-')}</span>
        }
        if (row.type === 'date') {
          return <span>{value ? new Date(value).toLocaleDateString('en-US') : '-'}</span>
        }
        return <span>{value ?? '-'}</span>
      }

      // textarea
      if (row.type === 'textarea') {
        return (
          <textarea
            name={row.key}
            value={value || ''}
            placeholder={row.placeholder}
            required={row.required}
            disabled={row.disabled}
            className="w-full px-3 py-2 border border-[var(--Stone-200)] rounded"
            rows={4}
            onChange={(e) => handleChange(row.key, e.target.value)}
          />
        )
      }

      // Image upload
      if (row.type === 'image') {
        const fileInputRef = React.useRef<HTMLInputElement>(null)

        return (
          <div className="space-y-2">
            {value && <img src={value} alt={row.label} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />}
            <input
              ref={fileInputRef}
              type="file"
              name={row.key}
              accept="image/*"
              disabled={row.disabled}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleChange(row.key, file)
                  // Generate URL for preview
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    handleChange(`${row.key}Preview`, e.target?.result)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-[var(--Stone-300)] rounded-md cursor-pointer hover:border-[var(--Stone-400)] transition-colors flex items-center justify-center"
              style={{ minHeight: '60px' }}
            >
              <span className="text-[var(--Stone-500)]">
                {value ? 'Change image' : 'Upload image (click)'}
              </span>
            </div>
          </div>
        )
      }

      // File upload
      if (row.type === 'file') {
        const fileInputRef = React.useRef<HTMLInputElement>(null)

        return (
          <div className="space-y-2">
            {value && <span className="text-sm text-gray-600">{value}</span>}
            <input
              ref={fileInputRef}
              type="file"
              name={row.key}
              disabled={row.disabled}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleChange(row.key, file)
                }
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-[var(--Stone-300)] rounded-md cursor-pointer hover:border-[var(--Stone-400)] transition-colors flex items-center justify-center"
              style={{ minHeight: '60px' }}
            >
              <span className="text-[var(--Stone-500)]">
                {value ? 'Change file' : 'Upload file (click)'}
              </span>
            </div>
          </div>
        )
      }

      // Date
      if (row.type === 'date') {
        let dateValue = ''
        if (value) {
          try {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              dateValue = date.toISOString().split('T')[0]
            }
          } catch (e) {
            console.error('Invalid date value:', value)
          }
        }
        // minDate handling: default is 'today', explicitly empty string means no limit
        const today = new Date().toISOString().split('T')[0]
        const minDate = row.minDate === '' ? undefined : (row.minDate === 'today' || row.minDate === undefined ? today : row.minDate)
        const maxDate = row.maxDate === 'today' ? today : row.maxDate

        return (
          <Input
            type="date"
            name={row.key}
            value={dateValue}
            min={minDate}
            max={maxDate}
            placeholder={row.placeholder}
            required={row.required}
            disabled={row.disabled}
            onChange={(e) => handleChange(row.key, e.target.value)}
          />
        )
      }

      // Date + Time
      if (row.type === 'datetime') {
        // minDate handling: default is 'today', explicitly empty string means no limit
        const today = new Date().toISOString().split('T')[0]
        const minDate = row.minDate === '' ? undefined : (row.minDate === 'today' || row.minDate === undefined ? today : row.minDate)
        const maxDate = row.maxDate === 'today' ? today : row.maxDate

        // If hourOnly is true, separate date and time (only hour input)
        if (row.hourOnly) {
          let dateValue = '';
          let hourValue = '00';

          if (value) {
            try {
              // String case
              if (typeof value === 'string' && value.includes('T')) {
                const [datePart, timePart] = value.split('T');
                dateValue = datePart;
                hourValue = timePart.split(':')[0];
              }
              // Date object or other format case
              else {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  dateValue = `${year}-${month}-${day}`;
                  hourValue = String(date.getHours()).padStart(2, '0');
                }
              }
            } catch (e) {
              console.error('Invalid datetime value:', value);
            }
          }

          return (
            <div className="flex gap-4">
              <input
                type="date"
                name={`${row.key}_date`}
                value={dateValue}
                min={minDate}
                max={maxDate}
                required={row.required}
                disabled={row.disabled}
                onChange={(e) => {
                  const newDate = e.target.value;
                  // Get the latest value from current formData
                  const currentValue = formData[row.key] ?? data[row.key];
                  let currentHour = hourValue; // Use the currently rendered time value
                  if (currentValue) {
                    try {
                      if (typeof currentValue === 'string' && currentValue.includes('T')) {
                        currentHour = currentValue.split('T')[1].split(':')[0];
                      } else {
                        const date = new Date(currentValue);
                        if (!isNaN(date.getTime())) {
                          currentHour = String(date.getHours()).padStart(2, '0');
                        }
                      }
                    } catch (e) {
                      // Keep rendered value on error
                    }
                  }

                  if (newDate) {
                    const combined = `${newDate}T${currentHour}:00:00`;
                    handleChange(row.key, combined);
                  }
                }}
                className="px-3 py-2 border border-[var(--Stone-200)] rounded-[4px] bg-transparent text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                style={{ flex: 2 }}
              />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  name={`${row.key}_hour`}
                  value={hourValue}
                  min="0"
                  max="23"
                  placeholder="0-23"
                  required={row.required}
                  disabled={row.disabled}
                  onChange={(e) => {
                    const newHour = e.target.value;
                    // Get the latest value from current formData
                    const currentValue = formData[row.key] ?? data[row.key];
                    let currentDate = dateValue; // Use the currently rendered date value
                    if (currentValue) {
                      try {
                        if (typeof currentValue === 'string' && currentValue.includes('T')) {
                          currentDate = currentValue.split('T')[0];
                        } else {
                          const date = new Date(currentValue);
                          if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            currentDate = `${year}-${month}-${day}`;
                          }
                        }
                      } catch (e) {
                        // Keep rendered value on error
                      }
                    }

                    if (currentDate && newHour !== '') {
                      const hourNum = parseInt(newHour);
                      if (hourNum >= 0 && hourNum <= 23) {
                        const combined = `${currentDate}T${String(hourNum).padStart(2, '0')}:00:00`;
                        handleChange(row.key, combined);
                      }
                    }
                  }}
                  className="px-3 py-2 border border-[var(--Stone-200)] rounded-[4px] bg-transparent text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ flex: 1 }}
                />
                <span className="text-[var(--Stone-500)]">H</span>
              </div>
            </div>
          )
        }

        // datetime-local min/max attributes use YYYY-MM-DDThh:mm format
        const minDateTime = minDate ? `${minDate}T00:00` : undefined
        const maxDateTime = maxDate ? `${maxDate}T23:59` : undefined

        return (
          <Input
            type="datetime-local"
            name={row.key}
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            min={minDateTime}
            max={maxDateTime}
            placeholder={row.placeholder}
            required={row.required}
            disabled={row.disabled}
            onChange={(e) => handleChange(row.key, e.target.value)}
          />
        )
      }

      // Toggle (tab bar style)
      if (row.type === 'toggle' && row.toggleOptions) {
        const currentValue = value !== undefined && value !== null
          ? String(value)
          : String(row.toggleOptions[0]?.value ?? '')

        return (
          <Tabs
            value={currentValue}
            onValueChange={(newValue) => {
              // Convert back to original type since it could be boolean or number
              const originalOption = row.toggleOptions?.find(opt => String(opt.value) === newValue)
              if (originalOption) {
                handleChange(row.key, originalOption.value)
              }
            }}
          >
            <TabsList style={{ fontSize: "12px" }}>
              {row.toggleOptions.map((option) => (
                <TabsTrigger
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={row.disabled}
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )
      }

      // Default input (text, number)
      return (
        <Input
          type={row.type === 'number' ? 'number' : 'text'}
          name={row.key}
          value={value ?? ''}
          placeholder={row.placeholder}
          required={row.required}
          disabled={row.disabled}
          onChange={(e) => {
            const newValue = row.type === 'number' ? Number(e.target.value) : e.target.value;
            handleChange(row.key, newValue);
          }}
        />
      )
    }

    return null
  }

  return (
    <div className="relative w-full overflow-x-auto border-2 border-[var(--Stone-200)]" style={{borderRadius: "4px"}}>
      <table className="w-full caption-bottom text-sm" style={{ borderCollapse: "collapse" }}>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th
                className="bg-[var(--Stone-100)] text-left font-medium whitespace-nowrap border-r border-b border-[var(--Stone-200)] last:border-b-0"
                style={{ width: labelWidth, padding: '10px 12px' }}
              >
                {row.label}
                {(mode === 'edit' || mode === 'create') && row.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </th>
              <td
                className="align-middle border-b border-[var(--Stone-200)] "
                style={{ padding: '10px 12px' }}
              >
                {renderValue(row)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}