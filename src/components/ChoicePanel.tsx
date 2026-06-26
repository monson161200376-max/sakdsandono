import type { Choice } from "../types/story";

interface ChoicePanelProps {
  choices: Choice[];
  disabled: boolean;

  selectedInNode?: string[];

  onChoose: (choice: Choice) => void;
}

export function ChoicePanel({ choices, disabled, selectedInNode = [], onChoose }: ChoicePanelProps) {

  const visibleChoices = choices.filter((choice) => {
  if (choice.showAfterSelection && selectedInNode.length === 0) {
    return false;
  }
  if (choice.id.startsWith("other")) return true;
  
  if (!choice.multi) return true;

  return !selectedInNode.includes(choice.id);
});

  return (
    <div className="grid gap-2">
      {visibleChoices.map((choice) => (
        <button
          disabled={disabled}
          key={choice.id}
          onClick={() => onChoose(choice)}
          className="rounded-md border border-slate-200 bg-white/95 px-4 py-3 text-left text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800 sm:text-base"
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
