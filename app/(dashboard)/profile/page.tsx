import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Profile
      </h1>

      <p className="text-gray-500 mt-1 mb-8">
        Manage your personal information
      </p>

      <ProfileCard
        name="Pranav Verma"
        email="pranav@example.com"
      />
    </div>
  );
}