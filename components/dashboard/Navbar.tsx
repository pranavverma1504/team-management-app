export default function Navbar() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex items-center gap-3">
        <span>Pranav</span>

        <div className="w-9 h-9 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}