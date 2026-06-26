import { useEffect, useMemo, useState } from "react";
import story from "../data/story.json";
import { analyzeChoices } from "../utils/analysis";
import { createSessionId, getElapsedSeconds } from "../utils/session";
import { flushPendingSnapshots, saveSurveySnapshot } from "../services/sheetsClient";
import type { Choice, ChoiceRecord, PlayerProfile, StoryNode } from "../types/story";

const nodes = story as StoryNode[];
const nodeMap = new Map(nodes.map((node) => [node.id, node]));

export function useGame() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<StoryNode[]>([]);
  const [choices, setChoices] = useState<ChoiceRecord[]>([]);
  const [completed, setCompleted] = useState(false);
  const [selectedInNode, setSelectedInNode] =
  useState<Record<string, string[]>>({});
  const [visitedMultiNode, setVisitedMultiNode] = useState<string[]>([]);

  const current = nodeMap.get(currentId) ?? nodes[0];
  const analysis = useMemo(() => analyzeChoices(choices), [choices]);
  const playTime = startedAt ? getElapsedSeconds(startedAt) : 0;

  const snapshot = useMemo(
    () =>
      profile
        ? {
            sessionId,
            nickname: profile.nickname,
            gender: profile.gender,
            choices,
            playTime,
            completed,
          }
        : null,
    [choices, completed, playTime, profile, sessionId],
  );

  useEffect(() => {
    void flushPendingSnapshots();
  }, []);

  useEffect(() => {
    if (!snapshot || !profile) return;
    void saveSurveySnapshot(snapshot);
  }, [choices.length, completed]);

  useEffect(() => {
    const saveOnExit = () => {
      if (!snapshot || completed) return;
      void saveSurveySnapshot({ ...snapshot, completed: false, playTime: getElapsedSeconds(startedAt) });
    };

    window.addEventListener("pagehide", saveOnExit);
    return () => window.removeEventListener("pagehide", saveOnExit);
  }, [completed, snapshot, startedAt]);

  function startGame(nextProfile: PlayerProfile) {
    const nextSessionId = createSessionId();
    const nextStartedAt = Date.now();

    setProfile(nextProfile);
    setSessionId(nextSessionId);
    setStartedAt(nextStartedAt);
    setCurrentId("start");
    setHistory([]);
    setChoices([]);
    setCompleted(false);

    void saveSurveySnapshot({
      sessionId: nextSessionId,
      nickname: nextProfile.nickname,
      gender: nextProfile.gender,
      choices: [],
      playTime: 0,
      completed: false,
    });
  }

  function restart() {
    if (profile) {
      startGame(profile);
      return;
    }

    setCurrentId("start");
    setHistory([]);
    setChoices([]);
    setCompleted(false);
    setSelectedInNode({});
  }

  function goNext(nextId?: string) {
    if (!nextId) {
      setCompleted(true);
      return;
    }
    setHistory((prev) => [...prev, current]);
    setCurrentId(nextId);
  }

  function choose(choice: Choice) {

    if (choice.finishMulti) {
    goNext(choice.next);
    return;
  }
    
  const record: ChoiceRecord = {
    index: choices.length + 1,
    nodeId: current.id,
    choiceId: choice.id,
    label: choice.label,
    value: choice.value,
    category: choice.category,
    chosenAt: new Date().toISOString(),
  };

  setChoices((prev) => [...prev, record]);

  if (choice.multi) {
    setSelectedInNode((prev) => ({
      ...prev,
      [current.id]: [
        ...(prev[current.id] ?? []),
        choice.id,
      ],
    }));

    setVisitedMultiNode((prev) =>
    prev.includes(current.id)
      ? prev
      : [...prev, current.id]
  );


    goNext(choice.multiNext);

    return;
  }

  goNext(choice.next);
}
function submitText(text: string) {
  const record: ChoiceRecord = {
    index: choices.length + 1,
    nodeId: current.id,
    choiceId: "free_text",
    label: "자유응답",
    value: text,
    category: "free_text",
    chosenAt: new Date().toISOString(),
  };

  setVisitedMultiNode((prev) =>
  prev.includes(current.id)
    ? prev
    : [...prev, current.id]
);

  setChoices((prev) => [...prev, record]);

  goNext(current.next);
}

  return {
  profile,
  current,
  history,
  choices,
  completed,
  selectedInNode,
  analysis,
  playTime,
  startGame,
  restart,
  goNext,
  choose,
  submitText,
};
}
