'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navConfig = [
  { label: '🎮 PLAY GAME', href: '/' },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF0] text-[#4A4A4A] font-sans selection:bg-[#FFD700] selection:text-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-[#FF6B6B]/20 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟡</span>
            <span className="font-black text-xl tracking-tight text-[#FF6B6B]">KIDS_PAC!</span>
          </div>
          <div className="flex gap-6">
            {navConfig.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-all px-4 py-2 rounded-full ${
                  pathname === link.href 
                    ? 'bg-[#FF6B6B] text-white shadow-lg scale-105' 
                    : 'text-[#4A4A4A] hover:bg-[#FFE66D]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl shadow-[#FF6B6B]/10 p-8 border-8 border-[#4ECDC4]/20">
          {children}
        </div>
      </main>
      <footer className="py-8 text-center bg-white border-t-4 border-[#FFE66D]/20 mt-12">
        <span className="text-sm font-bold text-[#4A4A4A]/40 uppercase tracking-[0.2em]">✨ HAVE FUN PLAYING! ✨</span>
      </footer>
    </div>
  );
}

