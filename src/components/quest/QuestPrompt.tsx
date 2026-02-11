import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Quest } from '@/types';

interface QuestPromptProps {
  quest: Quest;
}

export default function QuestPrompt({ quest }: QuestPromptProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">📝 Today&apos;s Quest</h2>

      <p className="mb-4 leading-relaxed text-slate-700">{quest.prompt}</p>

      <div className="flex gap-2">
        <Badge variant="outline">
          {quest.wordCountMin}-{quest.wordCountMax} words
        </Badge>
        <Badge variant="secondary">{quest.difficulty}</Badge>
        <Badge variant="secondary">{quest.category}</Badge>
      </div>
    </Card>
  );
}
