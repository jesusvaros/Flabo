"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketWithPosition } from "@/types/collections";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface BigTicketCardProps {
  ticket: TicketWithPosition;
  onClose: () => void;
  clickPosition: { x: number; y: number } | null;
}

export const BigTicketCard = ({
  ticket,
  onClose,
  clickPosition,
}: BigTicketCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const isMobile = useIsMobile();

  // Use effect to trigger animation after component mount
  useEffect(() => {
    // First make the component visible
    setIsVisible(true);
    
    // Small delay to ensure animation is triggered after visibility
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Stop propagation only for this component
    e.stopPropagation();
    
    // Close the current card
    onClose();
    
    // Simulate a new click at the same position to activate elements behind
    setTimeout(() => {
      // Create a new click event at the same position
      const newEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: e.clientX,
        clientY: e.clientY
      });
      
      // Get the element at that position
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      
      // Dispatch the event on that element if it exists
      if (elementUnder) {
        elementUnder.dispatchEvent(newEvent);
      }
    }, 10); // Small delay to ensure the current card has closed
  };

  // Handle drawer close with animation
  const handleDrawerClose = () => {
    // Start closing animation
    setDrawerOpen(false);
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300); // Match this with your animation duration
  };

  // Style for initial animation
  const style = !isOpen && clickPosition ? {
    top: `${clickPosition.y}px`,
    left: `${clickPosition.x}px`,
    transform: 'translate(-50%, -50%) scale(0.3)',
    opacity: isVisible ? 1 : 0, // Start invisible until ready
  } : {
    // Always centered in final position
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: 1,
  };

  // For mobile, render the Drawer component
  if (isMobile) {
    return (
      <Drawer 
        open={drawerOpen} 
        onOpenChange={(open) => {
          if (!open) {
            handleDrawerClose();
          }
        }} 
        snapPoints={[1.4]}
      >
        <DrawerContent className="bg-accent">
          <DrawerHeader className="border-b border-muted">
            <DrawerTitle>{ticket.content}</DrawerTitle>
            <button
              onClick={handleDrawerClose}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Close ticket details"
            >
              <X className="h-4 w-4" />
            </button>
          </DrawerHeader>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Position: {ticket.position}
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // For desktop, render the animated card
  return (
    <>
      <Card
        style={style}
        className={cn(
          "select-none fixed z-50 bg-accent border-muted shadow-lg",
          "w-[90%] max-w-2xl",
          "transition-all duration-300 ease-out"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="p-6">
          <CardTitle className="text-2xl text-foreground">
            {ticket.content}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Position: {ticket.position}
            </p>
          </div>
        </CardContent>
        <button
          onClick={handleBackdropClick}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Close ticket details"
        >
          <X className="h-4 w-4" />
        </button>
      </Card>
      <div 
        className="fixed inset-0 z-40"
        onClick={handleBackdropClick}
      />
    </>
  );
};
