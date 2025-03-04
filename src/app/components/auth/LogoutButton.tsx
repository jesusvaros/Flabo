"use client";
import { logout } from "@/app/auth/confirm/login/actions";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      type="button"
      variant="destructive"
    >
      Logout
    </Button>
  );
};
