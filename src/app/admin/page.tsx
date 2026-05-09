import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const isAuthenticated = (await cookies()).get('auth')?.value === 'true';

  if (!isAuthenticated) {
    redirect('/');
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-6 pt-12 md:pt-24 relative overflow-hidden min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[--color-neon-cyan] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[--color-neon-purple] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="z-10 w-full max-w-5xl">
        <AdminDashboard />
      </div>
    </main>
  );
}
