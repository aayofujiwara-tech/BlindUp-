interface Props {
  secondsLeft: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function TimerDisplay({ secondsLeft }: Props) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isLow = secondsLeft <= 60 && secondsLeft > 0;

  return (
    <div
      className={`font-mono font-bold tabular-nums transition-colors ${
        isLow ? "text-red-400" : "text-[var(--text)]"
      }`}
      style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
    >
      {pad(mins)}:{pad(secs)}
    </div>
  );
}
