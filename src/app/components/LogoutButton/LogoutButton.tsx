"use client";
import { logout } from "../../login/actions";

export const LogoutButton = () => {
  return (
    <button
      onClick={logout}
      type="submit"
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#ff4444",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};
