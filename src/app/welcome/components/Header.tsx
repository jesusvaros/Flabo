"use client";

import { useState } from "react";
import AuthForm from "../../login/authForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-lg z-50 p-4 bg-background/80">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center md:flex-row flex-col md:gap-0 gap-4">
        <div className="text-2xl font-bold text-foreground">Flabo</div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Log in / Sign up</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogContent className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-[100]">
              <DialogHeader>
                <DialogTitle>Welcome to Flabo</DialogTitle>
              </DialogHeader>
              <AuthForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </header>
  );
};
