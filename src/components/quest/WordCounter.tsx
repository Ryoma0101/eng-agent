interface WordCounterProps {
  wordCount: number;
  wordCountMin: number;
  wordCountMax: number;
}

export default function WordCounter({ wordCount, wordCountMin, wordCountMax }: WordCounterProps) {
  const isUnder = wordCount < wordCountMin;
  const isOver = wordCount > wordCountMax;
  const isValid = !isUnder && !isOver;

  const getColor = () => {
    if (wordCount === 0) return 'text-slate-400';
    if (isValid) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className={`text-sm ${getColor()}`}>
      単語数: {wordCount} / {wordCountMin}-{wordCountMax} words
      {wordCount > 0 && isUnder && (
        <span className="ml-2">（あと {wordCountMin - wordCount} words）</span>
      )}
      {isOver && <span className="ml-2">（{wordCount - wordCountMax} words 超過）</span>}
      {isValid && <span className="ml-2">✓</span>}
    </div>
  );
}
