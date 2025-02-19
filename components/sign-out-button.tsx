"use client";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          }
        }
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-blue-500 hover:underline"
    >
      Sign out
    </button>
  );
} 