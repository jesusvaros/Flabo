"use client";

import { LogoutButton } from "./auth/LogoutButton";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userEmail: string;
  className?: string;
}

export const HeaderLoggedIn = ({ userEmail, className }: HeaderProps) => {
  return (
    <header className={cn(
      "flex justify-end items-center border-b bg-accent z-10",
      className
    )}>
      <div className="flex gap-4 items-center flex justify-end items-center p-2">
        <span>{userEmail}</span>
        <LogoutButton />
      </div>
    </header>
  );
};
