interface BaseButtonProps {
  type?: 'button' | 'submit' | 'reset'
  label: string
  icon?: React.ReactNode
  height?: string
  width?: string
  borderRadius?: string | '4px'
  color?:
    | 'red'
    | 'gray'
    | 'blue'
    | 'black'
    | 'negative'
    | 'white'
    | 'darkRed'
    | 'lightgray'
  variant?: 'solid' | 'outline'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function BaseButton({
  type = 'button',
  label,
  icon,
  height = '36px',
  width = '100%',
  color = 'red',
  variant = 'solid',
  disabled = false,
  borderRadius = '4px',
  onClick,
  className = '',
}: BaseButtonProps) {
  const solidStyles = {
    red: 'bg-[var(--primary-500)] hover:bg-[var(--primary-700)] text-white cursor-pointer border-[var(--primary-500)]',
    gray: 'bg-[var(--Stone-500)] text-white cursor-not-allowed border-[var(--Stone-500)]',
    blue: 'bg-[var(--blue)] text-white cursor-pointer border-[var(--blue)]',
    black: 'bg-black text-white cursor-pointer border-black',
    negative:
      'bg-[var(--Red-600)] text-white cursor-pointer border-[var(--Red-600)]',
    white: 'bg-white text-black cursor-pointer border-[var(--Slate-200)]',
    darkRed:
      'bg-[var(--primary-900)] text-white cursor-pointer border-[var(--primary-900)]',
    lightgray:
      'bg-[var(--Stone-200)] text-white cursor-not-allowed border-[var(--Stone-200)]',
  }

  const outlineStyles = {
    red: 'bg-transparent hover:bg-[var(--primary-50)] text-[var(--primary-500)] cursor-pointer border-[var(--primary-500)]',
    gray: 'bg-transparent hover:bg-[var(--Stone-50)] text-[var(--Stone-500)] cursor-pointer  border-[var(--Stone-500)]',
    blue: 'bg-transparent hover:bg-[var(--blue-50)] text-[var(--blue)] cursor-pointer border-[var(--blue)]',
    black:
      'bg-transparent hover:bg-gray-50 text-black cursor-pointer border-black',
    negative:
      'bg-transparent hover:bg-[var(--Red-50)] text-[var(--Red-600)] cursor-pointer border-[var(--Red-600)]',
    white:
      'bg-transparent hover:bg-[var(--Slate-50)] text-[var(--Slate-500)] cursor-pointer border-[var(--Slate-500)]',
    darkRed:
      'bg-transparent hover:bg-[var(--Slate-50)] text-[var(--primary-900)] cursor-pointer border-[var(--primary-900)]',
    lightgray:
      'bg-[var(--Stone-200)] text-white cursor-not-allowed border-[var(--Stone-200)]',
  }

  const colorStyles = variant === 'outline' ? outlineStyles : solidStyles
  const borderWidth = variant === 'outline' ? '1px' : '2px'
  const fontWeight = variant === 'outline' ? 600 : 400

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${colorStyles[color]} transition-colors font-medium flex items-center justify-center gap-1 ${className}`}
      style={{ height, width, borderRadius, borderWidth, borderStyle: 'solid' }}
    >
      <span style={{ fontWeight, fontSize: 14 }}>{label}</span>
      {icon && <span className="flex items-center">{icon}</span>}
    </button>
  )
}
