import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BaseButton from './BaseButton'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  content?: ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  showCloseButton?: boolean
  confirmColor?: 'blue' | 'red' | 'negative'
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  content,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  confirmColor = 'blue',
  cancelLabel = 'Cancel',
  showCloseButton = true,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent showCloseButton={showCloseButton} className="bg-white border-0">
        {title && (
          <DialogHeader style={{textAlign:"center"}}>
            <DialogTitle style={{fontSize:'16px',fontWeight:'500', whiteSpace:'pre-line', lineHeight:'1.6'}}>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {content}

        <DialogFooter className="flex" style={{ gap: '36px'}}>
          <BaseButton
            label={cancelLabel}
            color="black"
            onClick={handleCancel}
            width="60px"
          />
          <BaseButton
            label={confirmLabel}
            color={confirmColor}
            onClick={handleConfirm}
            width="108px"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}