import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';
import type { UserProfile } from '@/types';

interface ScoreTrendProps {
  scoreBreakdown: UserProfile['scoreBreakdown'];
}

export default function ScoreTrend({ scoreBreakdown }: ScoreTrendProps) {
  const items = [
    { label: 'Grammar', value: scoreBreakdown.grammar, color: 'text-blue-600' },
    { label: 'Logic', value: scoreBreakdown.logic, color: 'text-green-600' },
    { label: 'Context', value: scoreBreakdown.context, color: 'text-purple-600' },
    { label: 'Fluency', value: scoreBreakdown.fluency, color: 'text-orange-600' },
  ];

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <BarChart3 className="h-4 w-4 text-slate-600" />
        </div>
        <h3 className="font-semibold text-slate-900">スコア傾向</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percentage = Math.round((item.value / 25) * 100);

          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>
                  {item.value}/25 ({percentage}%)
                </span>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
