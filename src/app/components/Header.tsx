"use client";

import { LogoutButton } from "./auth/LogoutButton";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userEmail: string;
  className?: string;
  leftElement?: React.ReactNode;
}

export const HeaderLoggedIn = ({ userEmail, className, leftElement }: HeaderProps) => {
  return (
    <header className={cn(
      "flex justify-between items-center border-b bg-accent z-50 fixed top-0 left-0 right-0 h-16",
      className
    )}>
      <div className="flex w-full justify-between items-center">
        {leftElement ? (
          <div className="p-2">
            {leftElement}
          </div>
        ) : (
          <div className="p-2"></div>
        )}
        <div className="flex gap-4 items-center p-2">
          <span className="text-sm text-muted-foreground">{userEmail}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
