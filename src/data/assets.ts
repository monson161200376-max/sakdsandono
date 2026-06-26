import type { CharacterId, CharacterVersion, Expression } from "../types/story";

type CharacterAssetMap = Record<CharacterId, Partial<Record<CharacterVersion, string>>>;

export const characterAssets: CharacterAssetMap = {
  female: {
    school: "/assets/characters/최아인-normal.png",
    question: "/assets/characters/최아인-question.png",
    smile: "/assets/characters/최아인-smile.png",
    smileclose: "/assets/characters/최아인-smile close.png",
    angryslight: "/assets/characters/최아인-angry slight.png",
    angrylittle: "/assets/characters/최아인-angry1.png",
    angrylittle_close: "/assets/characters/최아인-angry1.png",
    savage: "/assets/characters/최아인-angry.png",
    surprise:"/assets/characters/최아인-surprised.png",
    smilejoke:"/assets/characters/최아인-smilejoke.png",
    nodap:"/assets/characters/최아인-nodap.png",
    gamtan:"/assets/characters/최아인-gamtan.png",
    smileopen:"/assets/characters/최아인-smileopen.png"
  },
};

export const expressionLabels: Record<Expression, string> = {
  neutral: "기본",
  smile: "웃음",
  playful: "장난",
  flustered: "당황",
  serious: "진지",
  angry: "화남",
  sad: "슬픔",
};

export const characterNames: Record<CharacterId, string> = {
  female: "서윤",
};
