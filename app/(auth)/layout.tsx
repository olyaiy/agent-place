export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  );
} 