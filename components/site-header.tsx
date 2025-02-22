"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <header className="relative h-14 top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      
      
      <div className="container flex h-14 items-center justify-between  mx-auto  ">
      <SidebarTrigger />
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <span className="text-primary">Agents</span>
          <span>Place</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {session.user?.name ?? 'User'}</span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex gap-4">
              <Link 
                href={`/auth-form?callbackUrl=${encodeURIComponent(pathname)}`} 
                className="text-sm font-medium hover:underline"
              >
                Sign In / Sign Up
              </Link>
            </div>
          )}
          
        </nav>
      </div>
    </header>
  );
} 