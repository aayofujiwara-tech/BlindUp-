"use client";

interface Props {
  secondsLeft: number;
  totalSeconds: number;
}

export default function ProgressBar({ secondsLeft, totalSeconds }: Props) {
  const pct = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  return (
    <div className="w-full max-w-2xl h-3 bg-white/20 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
      />
    </div>
  );
}