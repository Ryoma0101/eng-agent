import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays } from 'lucide-react';
import type { UserProfile } from '@/types';

interface UserInfoProps {
  profile: UserProfile;
}

export default function UserInfo({ profile }: UserInfoProps) {
  const initials = profile.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const joinDate = new Date(profile.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {profile.photoURL && <AvatarImage src={profile.photoURL} alt={profile.displayName} />}
          <AvatarFallback className="bg-blue-100 text-xl font-bold text-blue-600">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{profile.displayName}</h2>
          {profile.email && <p className="text-sm text-slate-500">{profile.email}</p>}
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <CalendarDays className="h-3 w-3" />
            <span>参加日: {joinDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
