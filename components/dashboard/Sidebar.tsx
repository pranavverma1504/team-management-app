import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r p-5">
      <h2 className="text-xl font-bold mb-6">
        TaskFlow
      </h2>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>

        <Link href="/projects">Projects</Link>

        <Link href="/tasks">Tasks</Link>

        <Link href="/team">Team</Link>

        <Link href="/profile">Profile</Link>
      </nav>
    </aside>
  );
}