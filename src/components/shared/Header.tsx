'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PenLine, BarChart3, History, User, LogOut } from 'lucide-react';
import { mockCurrentUser } from '@/lib/mock-data';

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
  const router = useRouter();
  const items = navItems(demoMode);

  const initials = mockCurrentUser.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  function handleLogout() {
    // TODO: Firebase Auth連携
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={demoMode ? '/demo/dashboard' : '/dashboard'}
          className="flex items-center gap-2"
        >
          <img src="/logo.svg" alt="EnQuest" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-900">EnQuest{demoMode && ' (デモ)'}</span>
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

        {/* User Icon with Dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors hover:ring-2 hover:ring-slate-300 ${demoMode ? 'bg-amber-200 text-amber-700' : 'bg-blue-100 text-blue-600'}`}
              >
                {demoMode ? 'デ' : initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-slate-900">{mockCurrentUser.displayName}</p>
                <p className="text-xs text-slate-500">{mockCurrentUser.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                プロフィール
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
