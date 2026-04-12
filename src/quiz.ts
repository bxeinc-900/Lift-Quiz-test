export interface Question {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "What percentage of your retirement savings is currently in tax-deferred accounts (401k, IRA, 403b)?",
    options: [
      { text: "Less than 25%", score: 1 },
      { text: "25% - 50%", score: 2 },
      { text: "50% - 75%", score: 3 },
      { text: "More than 75% (The Tax Time Bomb)", score: 4 }
    ]
  },
  {
    id: 2,
    text: "Are you aware that the 2017 tax cuts are scheduled to expire in 2026, potentially increasing your tax liability on every dollar you've saved?",
    options: [
      { text: "I was aware and have a plan", score: 1 },
      { text: "I was aware but haven't acted", score: 3 },
      { text: "I was not aware of the 2026 deadline", score: 4 }
    ]
  },
  {
    id: 3,
    text: "In the event of a 20% market crash, how would your retirement plan protect you from 'Sequence of Returns' risk?",
    options: [
      { text: "I have a 0% floor protection", score: 1 },
      { text: "I would just wait for the market to recover", score: 3 },
      { text: "I would have to delay retirement or return to work", score: 4 }
    ]
  },
  {
    id: 4,
    text: "If you could spend the 'same dollar twice'—earning returns internally while using those funds for external investments—would that interest you?",
    options: [
      { text: "Yes, I want to maximize my capital's efficiency", score: 1 },
      { text: "I'm interested but don't understand how it works", score: 2 },
      { text: "No, I prefer traditional simple savings", score: 4 }
    ]
  },
  {
    id: 5,
    text: "What is your primary goal for your retirement assets?",
    options: [
      { text: "Accumulating the largest possible account balance", score: 3 },
      { text: "Maximizing predictable, net spendable cash flow", score: 1 },
      { text: "Leaving a legacy for the next generation", score: 2 }
    ]
  }
];

export function calculateExposure(scores: number[]): string {
  const total = scores.reduce((a, b) => a + b, 0);
  const max = questions.length * 4;
  const percentage = (total / max) * 100;

  if (percentage < 30) return "Low Exposure";
  if (percentage < 60) return "Moderate Exposure";
  return "Critical Tax & Market Exposure";
}
