import { Gauge, History, Moon, Play, RotateCcw, ScrollText, Sun, TimerReset } from "lucide-react";
import { formatPlayTime } from "../utils/session";

interface ControlsProps {
  darkMode: boolean;
  autoMode: boolean;
  textSpeed: number;
  playTime: number;
  onToggleDark: () => void;
  onToggleAuto: () => void;
  onChangeSpeed: (speed: number) => void;
  onOpenLog: () => void;
  onShowPrevious: () => void;
  onRestart: () => void;
}

export function Controls({
  darkMode,
  autoMode,
  textSpeed,
  playTime,
  onToggleDark,
  onToggleAuto,
  onChangeSpeed,
  onOpenLog,
  onShowPrevious,
  onRestart,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/70 bg-white/82 p-2 text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/82 dark:text-slate-200">
      <button className="vn-icon-button" onClick={onToggleDark} title="다크모드">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button className={`vn-icon-button ${autoMode ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200" : ""}`} onClick={onToggleAuto} title="자동 진행">
        <Play size={18} />
      </button>
      <button className="vn-icon-button" onClick={onOpenLog} title="로그">
        <ScrollText size={18} />
      </button>
      <button className="vn-icon-button" onClick={onShowPrevious} title="이전 대사">
        <History size={18} />
      </button>
      <button className="vn-icon-button" onClick={onRestart} title="처음부터">
        <RotateCcw size={18} />
      </button>
      <div className="ml-auto flex min-w-[170px] items-center gap-2 px-2">
        <Gauge size={16} />
        <input
          aria-label="텍스트 속도"
          type="range"
          min={10}
          max={65}
          value={textSpeed}
          onChange={(event) => onChangeSpeed(Number(event.target.value))}
          className="w-24 accent-sky-500"
        />
      </div>
      <div className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-2 text-xs font-bold dark:bg-slate-800">
        <TimerReset size={15} />
        {formatPlayTime(playTime)}
      </div>
    </div>
  );
}
