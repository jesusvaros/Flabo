"use client";
import { logout } from "../../login/actions";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  return (
    <Button
      onClick={logout}
      type="submit"
    >
      Logout
    </Button>
  );
};
