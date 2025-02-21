// DeleteButton.tsx
import { TrashIcon } from "lucide-react";

interface DeleteButtonProps {
  onDelete: () => void;
  deleteMessage?: string;
}

export function DeleteButton({ onDelete, deleteMessage = "Message deleted." }: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      className="flex items-center space-x-1 rounded bg-red-500 p-1 text-white hover:bg-red-600"
    >
      <TrashIcon className="h-4 w-4" />
      <span>{deleteMessage}</span>
    </button>
  );
}
