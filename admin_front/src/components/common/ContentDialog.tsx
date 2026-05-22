import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import BaseButton from "@/components/common/BaseButton.tsx";

interface ContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  title?: string
}

export default function ContentDialog({
  open,
  onOpenChange,
  content,
}: ContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-0 min-w-[800px]">
        <div className="mt-4 whitespace-pre-wrap break-words max-h-[800px] overflow-y-auto">
          {content || 'No content available.'}
        </div>
        <DialogFooter className="flex gap-9 justify-center mt-4">
          <BaseButton label='Cancel' color='black' onClick={() => onOpenChange(false)} width='60px' />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}