import { ReactNode, FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BaseButton from './BaseButton'

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  showCloseButton?: boolean
  submitDisabled?: boolean
}

export default function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  cancelLabel = '취소',
  showCloseButton = true,
  submitDisabled = false,
}: FormDialogProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent showCloseButton={showCloseButton} className="bg-white border-0">
        <form onSubmit={handleSubmit}>
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}

          <div className="py-4">
            {children}
          </div>

          <DialogFooter className="flex" style={{ gap: '36px'}}>
            <BaseButton
              type="button"
              label={cancelLabel}
              color="black"
              onClick={handleCancel}
              width="60px"
            />
            <BaseButton
              type="submit"
              label="확인"
              color="blue"
              disabled={submitDisabled}
              width="108px"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}