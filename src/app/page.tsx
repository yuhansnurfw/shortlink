import { cookies } from "next/headers";
import { ShortenForm } from "@/components/ShortenForm";
import { LoginForm } from "@/components/LoginForm";

export default async function Home() {
  const isAuthenticated = (await cookies()).get('auth')?.value === 'true';

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[--color-neon-cyan] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[--color-neon-purple] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 drop-shadow-2xl">
            yuranesia
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide">
            Shorten the distance. Expand the future.
          </p>
        </div>

        {/* Main Interface */}
        <div className="w-full">
          {isAuthenticated ? <ShortenForm /> : <LoginForm />}
        </div>

        {/* Footer info */}
        <div className="flex gap-8 text-sm text-gray-500">
          <span className="hover:text-white transition-colors cursor-pointer">Secure</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-700 self-center"></span>
          <span className="hover:text-white transition-colors cursor-pointer">Lightning Fast</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-700 self-center"></span>
          <span className="hover:text-white transition-colors cursor-pointer">Analytics Ready</span>
        </div>
      </div>
    </main>
  );
}
