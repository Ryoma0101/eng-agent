import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import type { UserProfile } from '@/types';

interface BadgeListProps {
  badges: UserProfile['badges'];
}

export default function BadgeList({ badges }: BadgeListProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
          <Award className="h-4 w-4 text-purple-600" />
        </div>
        <h3 className="font-semibold text-slate-900">バッジ</h3>
      </div>

      {badges.length === 0 ? (
        <p className="text-sm text-slate-500">まだバッジを獲得していません</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge.id} variant="secondary" className="px-3 py-1.5 text-sm">
              <span className="mr-1">{badge.icon}</span>
              {badge.label}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
