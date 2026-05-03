/**
 * AI-Voting Decision Engine
 * Rule-based intelligent system for voter readiness analysis.
 */

export const ANALYSIS_WEIGHTS = {
  registration: 0.4,
  verification: 0.3,
  logistics: 0.3,
  documents: 0, // Other tasks can be informative but not weighted for "core" readiness in this model
  awareness: 0
};

/**
 * Calculates weighted readiness score.
 * @param {Array} hurdles - Current hurdles state
 * @returns {number} Weighted score (0-100)
 */
export const calculateWeightedScore = (hurdles) => {
  if (!hurdles || hurdles.length === 0) return 0;
  
  let score = 0;
  hurdles.forEach(h => {
    if (h.completed && ANALYSIS_WEIGHTS[h.id]) {
      score += ANALYSIS_WEIGHTS[h.id];
    }
  });
  
  return Math.round(score * 100);
};

/**
 * Detects the most critical blockers based on weight and completion status.
 * @param {Array} hurdles - Current hurdles state
 * @returns {Object|null} The most critical uncompleted hurdle
 */
export const getCriticalBlocker = (hurdles) => {
  const uncompleted = hurdles
    .filter(h => !h.completed)
    .sort((a, b) => (ANALYSIS_WEIGHTS[b.id] || 0) - (ANALYSIS_WEIGHTS[a.id] || 0));
  
  return uncompleted.length > 0 ? uncompleted[0] : null;
};

/**
 * Generates prioritized recommendations.
 * @param {Array} hurdles - Current hurdles state
 * @returns {Array} List of prioritized actions
 */
export const getPrioritizedActions = (hurdles) => {
  return hurdles
    .filter(h => !h.completed)
    .sort((a, b) => (ANALYSIS_WEIGHTS[b.id] || 0) - (ANALYSIS_WEIGHTS[a.id] || 0));
};

/**
 * Explains the reasoning behind the current state.
 */
export const getEngineReasoning = (state) => {
  const { hurdles, readinessScore } = state;
  const blocker = getCriticalBlocker(hurdles);
  
  if (!blocker) {
    return "All critical voting requirements have been met. You are fully prepared.";
  }
  
  if (blocker.id === 'registration') {
    return "Voter registration is your top priority. Without it, you are legally ineligible to vote.";
  }
  
  if (blocker.id === 'verification') {
    return "Verification ensures your name is on the electoral roll. This prevents rejection at the booth.";
  }
  
  if (blocker.id === 'logistics') {
    return "Knowing your booth location is essential for a smooth voting day experience.";
  }
  
  return `Next step: ${blocker.title}. This will improve your readiness score.`;
};
