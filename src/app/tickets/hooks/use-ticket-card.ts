import { useState, useEffect } from "react";

// Hook for handling card animation
export function useCardAnimation(
  clickPosition: { x: number; y: number } | null
) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Small delay to ensure animation is triggered
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Create style based on whether we're animating from click position
  const style =
    clickPosition && isAnimating
      ? {
          top: `${clickPosition.y}px`,
          left: `${clickPosition.x}px`,
          transform: "translate(-50%, -50%) scale(0.3)",
          transition: "none",
        }
      : {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1)",
          transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        };

  return { style };
}

// Hook for handling drawer animation
export function useDrawerAnimation(onClose: () => void) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerClose = (): void => {
    setDrawerOpen(false);

    setTimeout(() => {
      onClose();
    }, 200);
  };

  const onDrawerOpenChange = (open: boolean): void => {
    if (!open) {
      handleDrawerClose();
    }
  };

  return {
    drawerOpen,
    handleDrawerClose,
    onDrawerOpenChange,
  };
}
