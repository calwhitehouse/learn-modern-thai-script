/** Score penalties for items seen in recent completed sessions. */
export const RECENT_SESSION_ITEM_PENALTY = 600;
export const PRIOR_SESSION_ITEM_PENALTY = 300;
export const RECENT_SESSION_LOOKBACK = 2;

/** Map each item to the strongest penalty from recent sessions (index 0 = most recent). */
export function buildRecentItemPenaltyMap(recentSessions: string[][]): Map<string, number> {
  const penalties = new Map<string, number>();
  const weights = [RECENT_SESSION_ITEM_PENALTY, PRIOR_SESSION_ITEM_PENALTY];

  recentSessions.forEach((sessionItems, sessionIndex) => {
    const penalty = weights[sessionIndex] ?? PRIOR_SESSION_ITEM_PENALTY;
    for (const item of sessionItems) {
      const existing = penalties.get(item) ?? 0;
      penalties.set(item, Math.max(existing, penalty));
    }
  });

  return penalties;
}
