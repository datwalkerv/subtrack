import { getCurrentUser, isAuthenticated } from "@/lib/auth/auth-functions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
