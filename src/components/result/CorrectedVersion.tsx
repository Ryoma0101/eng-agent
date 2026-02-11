import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, FileText } from 'lucide-react';

interface CorrectedVersionProps {
  correctedAnswer?: string;
}

export default function CorrectedVersion({ correctedAnswer }: CorrectedVersionProps) {
  const handleCopy = async () => {
    if (!correctedAnswer) return;
    try {
      await navigator.clipboard.writeText(correctedAnswer);
    } catch {
      // クリップボードAPIが使えない環境では無視
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <FileText className="h-5 w-5 text-slate-700" />
          添削済み完成版
        </h3>
        {correctedAnswer && (
          <Button variant="outline" size="sm" className="gap-1" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
            Copy
          </Button>
        )}
      </div>
      <div className="px-6 py-4">
        {correctedAnswer ? (
          <pre className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
            {correctedAnswer}
          </pre>
        ) : (
          <p className="text-sm text-slate-400">添削済み完成版は Phase 2 で実装予定です。</p>
        )}
      </div>
    </Card>
  );
}
