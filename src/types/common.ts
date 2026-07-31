export interface IDialogProps {
  open: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  onClose: () => void;
}
