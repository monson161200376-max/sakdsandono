import type { ChoiceRecord, Gender } from "../types/story.js";

interface ImportMetaEnv {
  readonly VITE_SHEETS_API_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export interface SurveySnapshot {
  sessionId: string;
  nickname: string;
  gender: Gender;
  choices: ChoiceRecord[];
  playTime: number;
  completed: boolean;
}

const endpoint = ((globalThis as any).process?.env?.VITE_SHEETS_API_URL ?? (globalThis as any).VITE_SHEETS_API_URL) as string | undefined;
const queueKey = "vn-survey-pending-snapshots";

function readQueue(): SurveySnapshot[] {
  try {
    return JSON.parse(localStorage.getItem(queueKey) ?? "[]") as SurveySnapshot[];
  } catch {
    return [];
  }
}

function writeQueue(queue: SurveySnapshot[]) {
  localStorage.setItem(queueKey, JSON.stringify(queue.slice(-20)));
}

function remember(snapshot: SurveySnapshot) {
  const queue = readQueue().filter((item) => item.sessionId !== snapshot.sessionId);
  writeQueue([...queue, snapshot]);
}

function forget(sessionId: string) {
  writeQueue(readQueue().filter((item) => item.sessionId !== sessionId));
}

function sendWithBeacon(url: string, snapshot: SurveySnapshot) {
  const body = JSON.stringify({ action: "snapshot", ...snapshot });
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, new Blob([body], { type: "text/plain;charset=utf-8" }));
  }
  return false;
}

export async function saveSurveySnapshot(snapshot: SurveySnapshot) {
  remember(snapshot);

  if (!endpoint) {
    return { ok: false, reason: "missing_endpoint" };
  }

  try {
    if (snapshot.completed && sendWithBeacon(endpoint, snapshot)) {
      forget(snapshot.sessionId);
      return { ok: true };
    }

    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "snapshot", ...snapshot }),
      keepalive: true,
    });
    forget(snapshot.sessionId);
    return { ok: true };
  } catch (error) {
    console.warn("Survey save failed. Snapshot remains queued.", error);
    return { ok: false, reason: "network" };
  }
}

export async function flushPendingSnapshots() {
  if (!endpoint) return;

  for (const snapshot of readQueue()) {
    await saveSurveySnapshot(snapshot);
  }
}
