import { Card } from '@/components/ui/card';
import { TrendingUp, Hash, Flame } from 'lucide-react';
import type { UserStats } from '@/types';

interface StatsCardsProps {
  stats: UserStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      label: '今日のスコア',
      value: stats.todayScore > 0 ? `${stats.todayScore}pt` : '—',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '順位',
      value: stats.rank > 0 ? `#${stats.rank}` : '—',
      icon: Hash,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '連続日数',
      value: `${stats.streak}日`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bgColor}`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="text-xs text-slate-500">{item.label}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
