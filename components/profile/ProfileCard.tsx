type ProfileCardProps = {
  name: string;
  email: string;
};

export default function ProfileCard({
  name,
  email,
}: ProfileCardProps) {
  return (
    <div className="max-w-xl border rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-300" />

        <div>
          <h2 className="text-xl font-semibold">
            {name}
          </h2>

          <p className="text-gray-500">
            {email}
          </p>
        </div>
      </div>

      <button className="border px-4 py-2 rounded-lg mt-6">
        Edit Profile
      </button>
    </div>
  );
}