'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PenLine, BarChart3, History, User } from 'lucide-react';

interface HeaderProps {
  demoMode?: boolean;
}

const navItems = (demoMode: boolean) => [
  { href: demoMode ? '/demo/dashboard' : '/dashboard', label: 'Dashboard', icon: PenLine },
  { href: demoMode ? '/demo/ranking' : '/ranking', label: 'Ranking', icon: BarChart3 },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Header({ demoMode = false }: HeaderProps) {
  const pathname = usePathname();
  const items = navItems(demoMode);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={demoMode ? '/demo/dashboard' : '/dashboard'}
          className="flex items-center gap-2"
        >
          <span className="text-lg font-bold text-slate-900">
            ✍️ AI英作文スコアリング{demoMode && ' (デモ)'}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? 'secondary' : 'ghost'} size="sm" className="gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Icon (placeholder) */}
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${demoMode ? 'bg-amber-200 text-amber-700' : 'bg-slate-200 text-slate-700'}`}
          >
            {demoMode ? 'デ' : 'D'}
          </div>
          {demoMode && <span className="text-sm font-medium text-amber-600">デモモード</span>}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex border-t border-slate-100 md:hidden">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
