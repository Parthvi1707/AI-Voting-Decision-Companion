// AI Decision Engine for VoteSense

// AI-based readiness calculation
export function calculateReadiness(user) {
  let score = 0

  if (user.isRegistered) score += 40
  if (user.isVerified) score += 30
  if (user.knowsBooth) score += 30

  return score
}

// AI-driven issue detection
export function getCriticalIssues(user) {
  const issues = []

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

// AI prioritization logic
export function getPriorityAction(issues) {
  return issues.length > 0 ? issues[0] : "No critical issues"
}

/**
 * AI-driven system integration helpers
 */

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
    return "AI Analysis: All systems are fully optimized. User is mission-ready for the polling booth.";
  }
  
  return `AI Decision Engine identifies '${blocker.title}' as the high-priority critical blocker. Failure to resolve this will result in participation friction.`;
};
