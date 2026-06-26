import { useEffect, useMemo, useState } from "react";
import { CharacterSprite } from "./CharacterSprite";
import { ChoicePanel } from "./ChoicePanel";
import { Controls } from "./Controls";
import { LogModal } from "./LogModal";
import { ResultPanel } from "./ResultPanel";
import { useTypewriter } from "../hooks/useTypewriter";
import type { Choice, StoryNode } from "../types/story";
import type { PlayerProfile } from "../types/story";

interface NovelStageProps {
  current: StoryNode;
  history: StoryNode[];
  completed: boolean;

  selectedInNode: string[];
  nickname: string;

  playTime: number;
  analysis: {
    title: string;
    description: string;
    scores: Record<string, number>;
  };

  profile: PlayerProfile;

  choices: import("../types/story").ChoiceRecord[];
  onNext: (nextId?: string) => void;
  onChoose: (choice: Choice) => void;
  onRestart: () => void;
  onSubmitText: (text: string) => void;
}

const toneOverlay = {
  warm: "bg-gradient-to-t from-white/40 via-transparent to-amber-100/20 dark:from-slate-950/50 dark:to-sky-950/20",
  tense: "bg-gradient-to-t from-slate-950/30 via-transparent to-cyan-950/20",
  heavy: "bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-red-950/25",
};

export function NovelStage({
  current,
  history,
  completed,

  selectedInNode,
  
  playTime,
  analysis,
  choices,

  profile,


  onNext,
  onChoose,
  onSubmitText,
  onRestart,
  nickname,
}: NovelStageProps) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("vn-dark") === "true");
  const [autoMode, setAutoMode] = useState(false);
  const [textSpeed, setTextSpeed] = useState(() => Number(localStorage.getItem("vn-speed") ?? 40));
  const [logOpen, setLogOpen] = useState(false);
  const [previousOpen, setPreviousOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const parsedText = current.text.replace(
  /\{player\}/g,
  profile.nickname
);

const displayText =(
  current.repeatText &&
  selectedInNode.length > 0
    ? current.repeatText
    : current.text
    ).replace("{player}", nickname || "김행동");  

console.log("원본:", displayText);
console.log("변환:", displayText.replace("{player}", "테스트닉네임"));
const typewriter = useTypewriter(
  displayText,
  textSpeed,
  completed
);
  const logEntries = useMemo(() => [...history, current], [current, history]);
  const previousEntry = [...history].reverse().find((entry) => entry.text !== current.text);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("vn-dark", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("vn-speed", String(textSpeed));
  }, [textSpeed]);

  useEffect(() => {
    if (!autoMode || !typewriter.isComplete || current.choices || completed) return;
    const timer = window.setTimeout(() => onNext(current.next), 1300);
    return () => window.clearTimeout(timer);
  }, [autoMode, completed, current, onNext, typewriter.isComplete]);

  function advance() {
    if (completed) return;
    if (!typewriter.isComplete) {
      typewriter.complete();
      return;
    }
    if (!current.choices) {
      onNext(current.next);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-100 text-slate-950 transition dark:bg-slate-950 dark:text-slate-50">
      <section className="relative min-h-screen">
        <img src={`/assets/backgrounds/${current.background}.png`}
  alt=""
  className="absolute inset-0 h-full w-full object-cover" />
        <div className={`absolute inset-0 ${toneOverlay[current.tone]}`} />
        {(current.characters ?? []).map((character) => (
          <CharacterSprite key={`${character.id}-${character.version}-${character.position}`} character={character} activeTone={current.tone} />
        ))}

        <div className="absolute left-0 right-0 top-0 z-30 p-3 sm:p-5">
          <Controls
            darkMode={darkMode}
            autoMode={autoMode}
            textSpeed={textSpeed}
            playTime={playTime}
            onToggleDark={() => setDarkMode((value) => !value)}
            onToggleAuto={() => setAutoMode((value) => !value)}
            onChangeSpeed={setTextSpeed}
            onOpenLog={() => setLogOpen(true)}
            onShowPrevious={() => setPreviousOpen((value) => !value)}
            onRestart={onRestart}
          />
        </div>

        {previousOpen && previousEntry ? (
          <aside className="absolute right-3 top-24 z-40 max-w-sm rounded-lg border border-white/70 bg-white/90 p-3 text-sm shadow-novel backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 sm:right-5">
            <p className="text-xs font-black text-sky-700 dark:text-sky-300">{previousEntry.speaker}</p>
            <p className="mt-1 leading-6 text-slate-700 dark:text-slate-200">{previousEntry.text}</p>
          </aside>
        ) : null}

        {!completed ? (
          <section className="absolute inset-x-0 bottom-0 z-30 mx-auto w-full max-w-5xl p-3 sm:p-5">
            <div className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-novel backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">{current.speaker === "player"
                ? profile.nickname
                : current.speaker}</h2>
              </div>
              <button className="min-h-[92px] w-full text-left text-base leading-8 text-slate-800 dark:text-slate-100 sm:text-lg" onClick={() => {
  if (current.input) return;
  advance();
}}>
                {typewriter.visibleText}
                {!typewriter.isComplete ? <span className="ml-0.5 animate-pulse">|</span> : null}
              </button>

              {current.choices && !current.input && typewriter.isComplete ? (
                <div className="mt-4">
                  <ChoicePanel choices={current.choices} disabled={!typewriter.isComplete} selectedInNode={selectedInNode} onChoose={onChoose}  />
                </div>
              ) : null}
              {current.input && typewriter.isComplete ? (
  <div className="mt-4 flex gap-2">
    <input
      className="flex-1 rounded border px-3 py-2 text-black"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="답변을 입력하세요"
    />

    <button
      className="rounded bg-blue-500 px-4 py-2 text-white"
      onClick={() => {
        if (!inputValue.trim()) return;

        onSubmitText(inputValue);

        setInputValue("");
      }}
    >
      제출
    </button>
  </div>
) : null}
            </div>
          </section>
        ) : (
          <ResultPanel
            title={analysis.title}
            description={analysis.description}
            scores={analysis.scores}
            choices={choices}
            playTime={playTime}
            onRestart={onRestart}
          />
        )}
      </section>
      <LogModal open={logOpen} entries={logEntries} onClose={() => setLogOpen(false)} />
    </main>
  );
}
