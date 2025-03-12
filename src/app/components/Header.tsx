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
      "flex justify-end items-center p-4 border-b bg-background z-10",
      className
    )}>
      <div className="flex justify-end items-center p-4">
        <div className="flex gap-4 items-center">
          <span>{userEmail}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
