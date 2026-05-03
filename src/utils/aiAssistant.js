import { getCriticalBlocker, getEngineReasoning } from './aiEngine';

/**
 * Intelligent System Reasoning Engine
 */
export const getSystemReasoning = (state) => {
  const { hurdles, readinessScore } = state;
  const blocker = getCriticalBlocker(hurdles);
  const readinessReasoning = `Your score of ${readinessScore}% is a weighted analysis of your registration, verification, and booth logistics status.`;
  
  let priorityReasoning = "";
  let consequenceReasoning = "";
  
  if (blocker) {
    priorityReasoning = getEngineReasoning(state);
    consequenceReasoning = `Impact: ${blocker.impact}. Failure to resolve this will result in critical friction during the voting process.`;
  } else {
    priorityReasoning = "All critical systems are optimized.";
    consequenceReasoning = "Deployment phase reached. You are fully ready to participate.";
  }

  return {
    readinessReasoning,
    priorityReasoning,
    consequenceReasoning
  };
};

/**
 * Main AI Insight Generator
 * Merges system reasoning with user-friendly guidance.
 */
export const getAIInsights = (state) => {
  const { hurdles, readinessScore, userProfile } = state;
  const blocker = getCriticalBlocker(hurdles);
  const reasoning = getSystemReasoning(state);

  if (!blocker) {
    return {
      message: "Voter Optimization Complete!",
      reason: reasoning.consequenceReasoning,
      suggestedAction: "Launch Simulation",
      route: "/simulation",
      type: "success"
    };
  }

  const journeyContext = `Focusing on critical blocker: ${blocker.title}.`;

  let insight = {
    message: "",
    reason: "",
    suggestedAction: blocker.act,
    route: "/hurdles",
    type: "warning",
    journeyContext,
    actions: [
      { label: "Open Guide", route: "/guide" },
      { label: "Take Next Step", route: "/hurdles" }
    ]
  };

  switch (blocker.id) {
    case 'registration':
      insight.message = "Critical: Registration Missing";
      insight.reason = reasoning.priorityReasoning;
      insight.suggestedAction = "Resolve Registration →";
      break;
    case 'verification':
      insight.message = "Verification Required";
      insight.reason = reasoning.priorityReasoning;
      insight.suggestedAction = "Check Voter Roll →";
      break;
    case 'logistics':
      insight.message = "Booth Location Unknown";
      insight.reason = reasoning.priorityReasoning;
      insight.suggestedAction = "Find My Booth →";
      break;
    default:
      insight.message = "Next Action Identified";
      insight.reason = reasoning.priorityReasoning;
      insight.suggestedAction = "Take Next Step →";
  }

  // Handle first-time voter edge case
  if (userProfile.isFirstTimeVoter && readinessScore > 80) {
    insight.message = "You've cleared the guide! Time to practice.";
    insight.reason = "You're at the final simulation stage. Let's walk through exactly what happens at the booth.";
    insight.suggestedAction = "Start Simulation →";
    insight.route = "/simulation";
    insight.actions = [{ label: "Review Guide", route: "/guide" }, { label: "Launch Sim", route: "/simulation" }];
  }

  return insight;
};
