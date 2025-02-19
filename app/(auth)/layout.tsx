"use client";

import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        // Only close if clicking on the backdrop (not children)
        if (e.target === e.currentTarget) {
          router.back();
        }
      }}
    >
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  );
} 