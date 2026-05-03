/**
 * AI Decision Engine for VoteSense
 * Provides intelligent, logic-based analysis for voter readiness.
 */

/**
 * AI-based readiness calculation
 * Calculates weighted score based on critical voting milestones.
 */
export function calculateReadiness(user) {
  let score = 0

  // AI-driven weighting logic
  if (user.isRegistered) score += 40
  if (user.isVerified) score += 30
  if (user.knowsBooth) score += 30

  return score
}

/**
 * AI-driven prioritization of critical issues
 * Detects blockers and generates intelligent warnings.
 */
export function getCriticalIssues(user) {
  const issues = []

  // Decision engine for user guidance
  if (!user.isRegistered) {
    issues.push("User is not registered to vote")
  }

  if (!user.isVerified) {
    issues.push("Name not found in voter list")
  }

  if (!user.knowsBooth) {
    issues.push("Polling booth information missing")
  }

  return issues
}

// Backward compatibility with previous implementation
export const calculateWeightedScore = (hurdles) => {
  const user = {
    isRegistered: hurdles.find(h => h.id === 'registration')?.completed,
    isVerified: hurdles.find(h => h.id === 'verification')?.completed,
    knowsBooth: hurdles.find(h => h.id === 'logistics')?.completed,
  };
  return calculateReadiness(user);
};

export const getCriticalBlocker = (hurdles) => {
  const uncompleted = hurdles
    .filter(h => !h.completed)
    .sort((a, b) => {
      const weights = { registration: 40, verification: 30, logistics: 30 };
      return (weights[b.id] || 0) - (weights[a.id] || 0);
    });
  
  return uncompleted.length > 0 ? uncompleted[0] : null;
};

export const getEngineReasoning = (state) => {
  const { hurdles } = state;
  const blocker = getCriticalBlocker(hurdles);
  
  if (!blocker) {
    return "AI Analysis: All critical voting systems are fully optimized. User is deployment-ready.";
  }
  
  return `AI Decision Engine identifies '${blocker.title}' as the primary critical blocker. High priority resolution required.`;
};
