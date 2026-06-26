import type { ChoiceRecord, DecisionCategory } from "../types/story";

const categoryCopy: Record<DecisionCategory, { title: string; description: string }> = {
  time: {
    title: "시간 효율형",
    description: "시작 전 부담과 소요 시간을 먼저 계산하는 편입니다.",
  },
  relationship: {
    title: "관계 반응형",
    description: "요청한 사람과의 친분이 참여 결정에 크게 작용합니다.",
  },
  interest: {
    title: "흥미 몰입형",
    description: "주제와 스토리가 궁금할수록 끝까지 따라가는 힘이 강합니다.",
  },
  reward: {
    title: "보상 기대형",
    description: "작은 보상이나 명확한 이득이 있을 때 참여 장벽이 낮아집니다.",
  },
  duty: {
    title: "책임 절차형",
    description: "도움이 된다면 기록을 남기고, 안정적인 절차를 중시합니다.",
  },
  pressure: {
    title: "분위기 민감형",
    description: "주변 분위기와 반복 요청이 선택에 영향을 줍니다.",
  },
  risk: {
    title: "즉시 행동형",
    description: "불확실한 상황에서도 필요한 일이라면 빠르게 움직입니다.",
  },
  empathy: {
    title: "공감 우선형",
    description: "결과만큼 사람의 감정과 관계의 온도를 중요하게 봅니다.",
  },
  free_text: {
  title: "자유응답",
  description: "직접 입력한 응답입니다.",
},
};

export function analyzeChoices(records: ChoiceRecord[]) {
  const scores = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.category] = (acc[record.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategory = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "interest") as DecisionCategory;

  return {
    scores,
    topCategory,
    ...categoryCopy[topCategory],
  };
}
