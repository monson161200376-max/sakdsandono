import { X } from "lucide-react";
import type { StoryNode } from "../types/story";

interface LogModalProps {
  open: boolean;
  entries: StoryNode[];
  onClose: () => void;
}

export function LogModal({ open, entries, onClose }: LogModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <section className="max-h-[82vh] w-full max-w-2xl overflow-hidden rounded-lg border border-white/70 bg-white shadow-novel dark:border-slate-700 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 className="text-lg font-black">대사 로그</h2>
          <button className="vn-icon-button" onClick={onClose} title="닫기">
            <X size={18} />
          </button>
        </header>
        <div className="max-h-[68vh] space-y-3 overflow-y-auto p-4">
          {entries.length === 0 ? (
            <p className="text-sm text-slate-500">아직 지나간 대사가 없습니다.</p>
          ) : (
            entries.map((entry) => (
              <article key={`${entry.id}-${entry.text}`} className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-xs font-bold text-sky-700 dark:text-sky-300">{entry.speaker}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{entry.text}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
