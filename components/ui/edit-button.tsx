import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-6 w-6"
      aria-label="Edit"
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Pencil
          className={cn(
            "h-4 w-4 transition-transform ease-in-out scale-100"
          )}
        />
      </div>
    </Button>
  );
}
