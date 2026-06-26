export function createSessionId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getElapsedSeconds(startedAt: number) {
  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

export function formatPlayTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
