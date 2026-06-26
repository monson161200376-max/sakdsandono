import { useState } from "react";
import type { FormEvent } from "react";
import { Sparkles } from "lucide-react";
import type { Gender, PlayerProfile } from "../types/story";

interface StartScreenProps {
  onStart: (profile: PlayerProfile) => void;
}

const genderOptions: Gender[] = ["남성", "여성",];

export function StartScreen({ onStart }: StartScreenProps) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!gender) {
    alert("성별을 선택해주세요.");
    return;
  }
    onStart({
      nickname: nickname.trim() || "김행동",
      gender,
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 transition dark:bg-slate-950 dark:text-slate-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300">
              <Sparkles size={16} />
              선택의 기억
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
              기억 한 조각
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              본 활동은 학생들의 설문조사 참여율을 비교하고자 만든 비주얼 노벨 형식 설문조사로 진행되는 이야기에 자신이 생각하는 선택지를 고름에 따라 이야기가 진행됩니다. 본 설문조사의 결과는 탐구가 종료되는 즉시 파기될 예정 입니다.
            </p>
          </div>

          <form onSubmit={submit} className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-novel backdrop-blur dark:border-slate-700 dark:bg-slate-900/88">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">닉네임</span>
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-base outline-none ring-sky-400 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
                  maxLength={20}
                  placeholder="김행동으로 진행 가능"
                />
              </label>

              <fieldset>
                <legend className="text-sm font-bold text-slate-700 dark:text-slate-200">성별</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {genderOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setGender(option)}
                      className={`rounded-md border px-3 py-3 text-sm font-bold transition ${
                        gender === option
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button className="w-full rounded-md bg-slate-950 px-5 py-3 text-base font-black text-white transition hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-200">
                시작하기
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
