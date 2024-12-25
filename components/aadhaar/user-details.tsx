interface UserDetailsProps {
  userData: {
    name: string;
    gender: string;
    dob: string;
    address: string;
  };
}

export function UserDetails({ userData }: UserDetailsProps) {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">User Details</h3>
      <div className="grid gap-2">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>DOB:</strong> {userData.dob}</p>
        <p><strong>Address:</strong> {userData.address}</p>
      </div>
    </div>
  );
}