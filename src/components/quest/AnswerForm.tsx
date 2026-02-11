'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import WordCounter from '@/components/quest/WordCounter';

interface AnswerFormProps {
  answer: string;
  onAnswerChange: (value: string) => void;
  wordCount: number;
  wordCountMin: number;
  wordCountMax: number;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}

export default function AnswerForm({
  answer,
  onAnswerChange,
  wordCount,
  wordCountMin,
  wordCountMax,
  submitting,
  error,
  onSubmit,
}: AnswerFormProps) {
  const isValid = wordCount >= wordCountMin && wordCount <= wordCountMax;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        placeholder="英作文を入力してください..."
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        rows={12}
        disabled={submitting}
        className="resize-y"
      />

      <WordCounter wordCount={wordCount} wordCountMin={wordCountMin} wordCountMax={wordCountMax} />

      <Button
        onClick={onSubmit}
        disabled={submitting || !isValid}
        className="w-full gap-2"
        size="lg"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            採点中...
          </>
        ) : (
          'Submit for Scoring'
        )}
      </Button>
    </div>
  );
}
