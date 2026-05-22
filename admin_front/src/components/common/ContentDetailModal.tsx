import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  content: string;
}

export function ContentDetailModal({ isOpen, onClose, title, category, content }: ContentDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {title}
          </DialogTitle>
          {category && (
            <DialogDescription className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {category}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="whitespace-pre-wrap text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {content || "내용이 없습니다."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
