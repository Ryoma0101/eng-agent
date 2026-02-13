// src/components/result/ScoreBreakdown.tsx
import { Card } from '@/components/ui/card';

interface ScoreBreakdownProps {
  scores: {
    grammar: number;
    logic: number;
    context: number;
    fluency: number;
  };
}

export default function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const items = [
    { label: 'Grammar', value: scores.grammar, max: 25 },
    { label: 'Logic', value: scores.logic, max: 25 },
    { label: 'Context', value: scores.context, max: 25 },
    { label: 'Fluency', value: scores.fluency, max: 25 },
  ];

  return (
    <Card className="border-0 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold text-slate-900">スコア内訳</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {item.value} <span className="text-xs text-slate-400">/{item.max}</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
