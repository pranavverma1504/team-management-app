import MemberCard from "@/components/team/MemberCard";

export default function TeamPage() {
  return (
    <div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Team
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your team members
          </p>
        </div>

        <button className="border px-4 py-2 rounded-lg">
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

        <MemberCard
          name="Pranav"
          email="pranav@example.com"
          role="OWNER"
        />

        <MemberCard
          name="Rahul"
          email="rahul@example.com"
          role="ADMIN"
        />

        <MemberCard
          name="Aman"
          email="aman@example.com"
          role="MEMBER"
        />

      </div>

    </div>
  );
}