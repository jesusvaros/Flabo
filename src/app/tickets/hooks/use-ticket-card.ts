import { useState, useEffect } from "react";

// Hook for handling card animation
export function useCardAnimation(clickPosition: { x: number; y: number } | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // First make the component visible
    setIsVisible(true);
    
    // Small delay to ensure animation is triggered after visibility
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

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

  return { style };
}

// Hook for handling drawer animation
export function useDrawerAnimation(onClose: () => void) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerClose = (): void => {
    // Start closing animation
    setDrawerOpen(false);
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300); // Match this with your animation duration
  };

  // Define the function with explicit type before using it
  const onDrawerOpenChange = (open: boolean): void => {
    if (!open) {
      handleDrawerClose();
    }
  };

  return { 
    drawerOpen, 
    handleDrawerClose,
    onDrawerOpenChange
  };
}