export type Gender = "남성" | "여성" ;

export type CharacterId = "female";

export type CharacterVersion = "school"| "savage"| "angry"| "question"| "smile"| "smileclose"| "angryslight"| "angrylittle"| "surprise"| "smilejoke"| "nodap"| "gamtan"| "smileopen"| "angrylittle_close";

export type Expression =
  | "neutral"
  | "smile"
  | "playful"
  | "flustered"
  | "serious"
  | "angry"
  | "sad";

export type DecisionCategory =
  | "time"
  | "relationship"
  | "interest"
  | "reward"
  | "duty"
  | "pressure"
  | "risk"
  | "empathy"
  | "free_text";

export interface SceneCharacter {
  id: CharacterId;
  version: CharacterVersion;
  expression: Expression;
  position: "left" | "center" | "right";
}

export interface Choice {
  id: string;
  label: string;

  value: string;
  next: string;

  category: DecisionCategory;

  multi?: boolean;
  multiNext?: string;
  finishMulti?: boolean;
  showAfterSelection?: boolean;
}

export interface StoryNode {
  id: string;
  act: "school" | "war" | "ending";
  background: string;
  tone: "warm" | "tense" | "heavy";
  speaker: string;
  text: string;
  characters: SceneCharacter[];
  next?: string;
  choices?: Choice[];
  input?: boolean;
  repeatText?: string;
}

export interface ChoiceRecord {
  index: number;
  nodeId: string;
  choiceId: string;
  label: string;
  value: string;
  category: DecisionCategory;
  chosenAt: string;
}

export interface PlayerProfile {
  nickname: string;
  gender: Gender;
}
