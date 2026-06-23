export function speak(text: string, lang: string, volume: number = 1) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "ja" ? "ja-JP" : "en-US";
  utterance.volume = volume;
  window.speechSynthesis.speak(utterance);
}

export function activateTts() {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance("");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}