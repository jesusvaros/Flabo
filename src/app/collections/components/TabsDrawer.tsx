'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Layers } from "lucide-react";

interface TabsDrawerProps {
  children: React.ReactNode;
}

export function TabsDrawer({ children }: TabsDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Ingredients</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ingredients</SheetTitle>
          <SheetDescription>
            View all the ingredients for this collection
          </SheetDescription>
        </SheetHeader>
        <div className="h-full w-full pt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
