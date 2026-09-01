import { auth } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span>{session?.user?.name || "User"}</span>

        <div className="w-9 h-9 rounded-full bg-gray-300" />

        <LogoutButton />
      </div>
    </header>
  );
}