import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">📝 Today&apos;s Quest</h2>
        <Badge variant="outline">{quest.difficulty}</Badge>
      </div>

      <p className="mb-4 leading-relaxed text-slate-600">
        {quest.prompt.length > 120 ? quest.prompt.substring(0, 120) + '...' : quest.prompt}
      </p>

      <div className="mb-4 flex gap-2">
        <Badge variant="secondary">
          {quest.wordCountMin}-{quest.wordCountMax} words
        </Badge>
        <Badge variant="secondary">{quest.category}</Badge>
      </div>

      <Link href={`/quest?questId=${quest.questId}`}>
        <Button className="w-full gap-2 sm:w-auto">
          Start Quest
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </Card>
  );
}
