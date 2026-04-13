export interface Question {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "What percentage of your retirement savings is currently in tax-deferred accounts (401k, Traditional IRA, 403b)?",
    options: [
      { text: "Less than 25%", score: 1 },
      { text: "25% – 50%", score: 2 },
      { text: "50% – 75%", score: 3 },
      { text: "More than 75% — potentially all tax-deferred", score: 4 }
    ]
  },
  {
    id: 2,
    text: "Tax rates on traditional retirement withdrawals are determined by Congress and can change. How prepared are you if your tax rate in retirement is higher than it is today?",
    options: [
      { text: "Very prepared — I have a tax-diversified strategy", score: 1 },
      { text: "Somewhat prepared — I've thought about it but haven't acted", score: 3 },
      { text: "Not prepared — most of my savings are in pre-tax accounts", score: 4 }
    ]
  },
  {
    id: 3,
    text: "In the event of a significant market downturn early in retirement, how would your plan protect your income?",
    options: [
      { text: "I have a guaranteed floor — my income doesn't drop with markets", score: 1 },
      { text: "I would reduce spending and wait for markets to recover", score: 3 },
      { text: "I'm not sure — I haven't stress-tested my plan for this scenario", score: 4 }
    ]
  },
  {
    id: 4,
    text: "Are you aware that certain properly structured financial products can allow your money to earn market-linked growth while also being available as collateral for tax-free loans?",
    options: [
      { text: "Yes, and I already use this strategy", score: 1 },
      { text: "I've heard of it but don't fully understand how it works", score: 2 },
      { text: "No, I wasn't aware of this — I'd like to learn more", score: 4 }
    ]
  },
  {
    id: 5,
    text: "What is your primary goal for your retirement assets?",
    options: [
      { text: "Accumulating the largest possible pre-tax account balance", score: 3 },
      { text: "Maximizing predictable, net spendable after-tax cash flow", score: 1 },
      { text: "Leaving a tax-efficient legacy for the next generation", score: 2 }
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
