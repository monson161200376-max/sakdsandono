import { BarChart3, RotateCcw } from "lucide-react";
import type { ChoiceRecord } from "../types/story";
import { formatPlayTime } from "../utils/session";

interface ResultPanelProps {
  title: string;
  description: string;
  scores: Record<string, number>;
  choices: ChoiceRecord[];
  playTime: number;
  onRestart: () => void;
}

const categoryNames: Record<string, string> = {
  time: "시간",
  relationship: "친분",
  interest: "흥미",
  reward: "보상",
  duty: "책임",
  pressure: "압박",
  risk: "위험 감수",
  empathy: "공감",
};

export function ResultPanel({ title, description, scores, choices, playTime, onRestart }: ResultPanelProps) {
  const maxScore = Math.max(1, ...Object.values(scores));

  return (
    <section className="absolute inset-x-0 bottom-0 z-40 mx-auto w-full max-w-5xl p-3 sm:p-5">
      <div className="rounded-lg border border-white/70 bg-white/94 p-4 shadow-novel backdrop-blur dark:border-slate-700 dark:bg-slate-900/94">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
              <BarChart3 size={20} />
              <span className="text-sm font-black">의사결정 패턴</span>
            </div>
            <h2 className="mt-1 text-2xl font-black">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-700 dark:bg-white dark:text-slate-950" onClick={onRestart}>
            <RotateCcw size={16} />
            다시 플레이
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div className="space-y-2">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category}>
                <div className="mb-1 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>{categoryNames[category] ?? category}</span>
                  <span>{score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${(score / maxScore) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
            <p className="font-black">완료 정보</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">선택 수: {choices.length}개</p>
            <p className="text-slate-600 dark:text-slate-300">플레이 시간: {formatPlayTime(playTime)}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              설문조사에 참여해주셔서 감사합니다. 후 이야기가 언젠가 나올 수도?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
