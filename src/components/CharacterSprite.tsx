import { characterAssets, characterNames, expressionLabels } from "../data/assets";
import type { SceneCharacter } from "../types/story";

interface CharacterSpriteProps {
  character: SceneCharacter;
  activeTone: "warm" | "tense" | "heavy";
}

const positionClass = {
  left: "left-[4%] sm:left-[8%] translate-y-1/4",
  center: "left-1/2 -translate-x-1/2",
  right: "right-[4%] sm:right-[10%]",
};


const toneClass = {
  warm: "brightness-105 saturate-110",
  tense: "brightness-95 saturate-75 contrast-105",
  heavy: "brightness-75 saturate-50 contrast-110",
};

export function CharacterSprite({ character, activeTone }: CharacterSpriteProps) {
  const src = characterAssets[character.id][character.version];
  const spriteConfig: Record<
  string,
  {
    width: string;
    maxWidth: string;
    bottom: string;
  }
> = {

  "female-school": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-angrylittle_close": {
    width: "w-[70w]",
    maxWidth: "max-w-[900px]",
    bottom: "bottom-[0%]",
  },

  "female-savage": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-question": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-smile": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-smileclose": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-angryslight": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-angrylittle": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-surprise": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-smilejoke": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-nodap": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-gamtan": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },

  "female-smileopen": {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  },
  
};

const config =
  spriteConfig[`${character.id}-${character.version}`] ?? {
    width: "w-[65vw]",
    maxWidth: "max-w-[650px]",
    bottom: "bottom-[8%]",
  };

  return (
    <div
  className={`
    absolute z-10
    ${config.bottom}
    ${config.width}
    ${config.maxWidth}
    ${positionClass[character.position]}
  `}
>
      <img
        src={src}
        alt={`${characterNames[character.id]} ${expressionLabels[character.expression]}`}
        className={`h-auto w-full drop-shadow-2xl transition duration-500 ${toneClass[activeTone]}`}
      />
      <div className="mx-auto mt-[-18px] w-fit rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm dark:bg-slate-950/80 dark:text-slate-200">
        {expressionLabels[character.expression]}
      </div>
    </div>
  );
}
