type MemberCardProps = {
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
};

export default function MemberCard({
  name,
  email,
  role,
}: MemberCardProps) {
  return (
    <div className="border rounded-xl p-5">
      <div className="flex items-center gap-4">
        
        {/* Temporary profile image */}
        <div className="w-12 h-12 rounded-full bg-gray-300" />

        <div>
          <h2 className="font-semibold">
            {name}
          </h2>

          <p className="text-sm text-gray-500">
            {email}
          </p>

          <p className="text-sm mt-1">
            {role}
          </p>
        </div>

      </div>
    </div>
  );
}