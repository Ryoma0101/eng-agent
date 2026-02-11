import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Lightbulb } from 'lucide-react';

interface PhraseExtractionProps {
  phrases?: string[];
}

export default function PhraseExtraction({ phrases }: PhraseExtractionProps) {
  const handleCopy = async () => {
    if (!phrases?.length) return;
    const text = phrases.join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // クリップボードAPIが使えない環境では無視
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <Lightbulb className="h-5 w-5 text-slate-700" />
          使えるフレーズ
        </h3>
        {phrases?.length ? (
          <Button variant="outline" size="sm" className="gap-1" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
            Copy
          </Button>
        ) : null}
      </div>
      <div className="px-6 py-4">
        {phrases?.length ? (
          <div className="flex flex-wrap gap-2">
            {phrases.map((phrase) => (
              <span
                key={phrase}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {phrase}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">フレーズ抽出は Phase 2 で実装予定です。</p>
        )}
      </div>
    </Card>
  );
}
