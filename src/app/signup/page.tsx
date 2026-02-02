'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignupPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex justify-center">
        <SignUp />
      </div>
    </main>
  );
}