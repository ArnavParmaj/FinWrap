import type { SimplifiedDebt } from "../types";

export function formatINRSplit(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function simplifyDebts(balances: Record<string, number>): SimplifiedDebt[] {
  // We work in integer cents to prevent floating point inaccuracies
  const debtors: { member: string; balanceCents: number }[] = [];
  const creditors: { member: string; balanceCents: number }[] = [];

  for (const [member, balance] of Object.entries(balances)) {
    const cents = Math.round(balance * 100);
    if (cents < 0) {
      debtors.push({ member, balanceCents: cents });
    } else if (cents > 0) {
      creditors.push({ member, balanceCents: cents });
    }
  }

  // Greedy approach: Match the largest debtor with the largest creditor
  debtors.sort((a, b) => a.balanceCents - b.balanceCents); // More negative first (highest absolute)
  creditors.sort((a, b) => b.balanceCents - a.balanceCents); // More positive first

  const debts: SimplifiedDebt[] = [];
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const oweAmount = Math.abs(debtor.balanceCents);
    const haveAmount = creditor.balanceCents;

    const settleCents = Math.min(oweAmount, haveAmount);

    if (settleCents > 0) {
      debts.push({
        debtor: debtor.member,
        creditor: creditor.member,
        amount: settleCents / 100
      });
    }

    debtor.balanceCents += settleCents;
    creditor.balanceCents -= settleCents;

    if (debtor.balanceCents === 0) dIndex++;
    if (creditor.balanceCents === 0) cIndex++;
  }

  return debts;
}
