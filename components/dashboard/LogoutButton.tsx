"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="border px-3 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}