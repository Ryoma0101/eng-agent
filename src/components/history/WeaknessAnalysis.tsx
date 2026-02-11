import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import type { Submission } from '@/types';

interface WeaknessAnalysisProps {
  submissions: Submission[];
}

export default function WeaknessAnalysis({ submissions }: WeaknessAnalysisProps) {
  if (submissions.length === 0) {
    return null;
  }

  // 各項目の平均を計算（0-25 → 0-100%へ換算）
  const avg = {
    grammar: 0,
    logic: 0,
    context: 0,
    fluency: 0,
  };

  for (const sub of submissions) {
    avg.grammar += sub.scores.grammar;
    avg.logic += sub.scores.logic;
    avg.context += sub.scores.context;
    avg.fluency += sub.scores.fluency;
  }

  const count = submissions.length;
  const items = [
    { label: 'Grammar', value: avg.grammar / count, color: 'text-blue-600' },
    { label: 'Logic', value: avg.logic / count, color: 'text-green-600' },
    { label: 'Context', value: avg.context / count, color: 'text-purple-600' },
    { label: 'Fluency', value: avg.fluency / count, color: 'text-orange-600' },
  ];

  // 最も低い項目を弱点として表示
  const weakest = items.reduce((min, item) => (item.value < min.value ? item : min), items[0]);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
        </div>
        <h3 className="font-semibold text-slate-900">弱点分析</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percentage = Math.round((item.value / 25) * 100);
          const isWeakest = item.label === weakest.label;

          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                  {isWeakest && <span className="ml-2 text-xs text-red-500">-- 要改善</span>}
                </span>
                <span className={`text-sm font-bold ${item.color}`}>
                  {item.value.toFixed(1)}/25 ({percentage}%)
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
