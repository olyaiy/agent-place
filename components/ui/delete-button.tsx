// components/ui/delete-button.tsx
import { Trash } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  tooltip?: string;
}

export function DeleteButton({ onClick, tooltip = "Delete message" }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded hover:bg-red-100 text-red-600 transition duration-200"
      aria-label={tooltip}
      title={tooltip}
    >
      <Trash className="h-4 w-4" />
    </button>
  );
}
