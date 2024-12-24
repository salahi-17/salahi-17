// components/UpdateActivityDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ActivityUploadForm from "./ActivityUploadForm";
import { Activity } from "@/types"; // Import from our types file

interface UpdateActivityDialogProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function UpdateActivityDialog({
  activity,
  isOpen,
  onClose,
  onSubmitSuccess
}: UpdateActivityDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Activity: {activity?.name}</DialogTitle>
        </DialogHeader>
        {activity && (
          <ActivityUploadForm
            activity={activity}
            onSubmitSuccess={() => {
              onSubmitSuccess();
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}