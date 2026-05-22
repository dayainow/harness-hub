import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface ImageDialogProps {
  open: boolean
  image: string
  onOpenChange: (open: boolean) => void
  showCloseButton?: boolean
}

export default function ImageDialog({
  open,
  image,
  onOpenChange,
  showCloseButton = true,
}: ImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className="bg-white border-0">
        <img src={image} alt="Preview" className="w-full h-auto" />
      </DialogContent>
    </Dialog>
  )
}