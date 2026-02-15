'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest;
}

interface SubmissionGetResponse {
  submissionId: string;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleStartQuest() {
    try {
      setChecking(true);
      const submission = await apiClient<SubmissionGetResponse>('/api/submissions/get');
      router.push(`/result?submissionId=${submission.submissionId}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        router.push(`/quest?questId=${quest.questId}`);
        return;
      }
      router.push('/quest');
    } finally {
      setChecking(false);
    }
  }

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

      <Button className="w-full gap-2 sm:w-auto" onClick={handleStartQuest} disabled={checking}>
        {checking ? 'Checking...' : 'Start Quest'}
        {!checking && <ArrowRight className="h-4 w-4" />}
      </Button>
    </Card>
  );
}
