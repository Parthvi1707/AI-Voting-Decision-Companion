/**
 * Intelligent System Reasoning Engine
 * Provides deterministic, logic-based explanations for system states.
 */
export const getSystemReasoning = (state) => {
  const { hurdles, readinessScore, userProfile } = state;
  const uncompleted = hurdles.filter(h => !h.completed);

  // 1. Why readiness score is what it is
  const totalSteps = hurdles.length;
  const completedCount = totalSteps - uncompleted.length;
  const readinessReasoning = `Your score of ${readinessScore}% is calculated based on ${completedCount} of ${totalSteps} critical requirements being fully verified.`;

  // 2. Why a blocker is prioritized (Deterministic: first uncompleted in order)
  let priorityReasoning = "";
  let consequenceReasoning = "";
  
  if (uncompleted.length > 0) {
    const priority = uncompleted[0];
    priorityReasoning = `We've prioritized '${priority.title}' because it represents the most immediate legal or logistical barrier to your participation.`;
    consequenceReasoning = `If this remains unresolved, you face a high risk of: ${priority.impact.toLowerCase()}.`;
  } else {
    priorityReasoning = "All critical blockers have been resolved.";
    consequenceReasoning = "You are now eligible for a seamless voting experience.";
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
  const uncompleted = hurdles.filter(h => !h.completed);
  const reasoning = getSystemReasoning(state);

  if (uncompleted.length === 0) {
    return {
      message: "You're 100% ready to make your voice heard!",
      reason: reasoning.consequenceReasoning,
      suggestedAction: "Start Voting Simulation",
      route: "/simulation",
      type: "success"
    };
  }

  const priority = uncompleted[0];
  let insight = {
    message: "",
    reason: "",
    suggestedAction: priority.act,
    route: "/hurdles",
    type: "warning"
  };

  switch (priority.id) {
    case 'registration':
      insight.message = "You're just a few steps away from being fully ready.";
      insight.reason = `${reasoning.priorityReasoning} Without registration, you are legally ineligible to vote.`;
      insight.suggestedAction = "Register Now →";
      break;
    case 'verification':
      insight.message = "Your name might not be verified in the voter list yet.";
      insight.reason = `${reasoning.consequenceReasoning} Verification ensures your entry at the booth is guaranteed.`;
      insight.suggestedAction = "Check Voter List →";
      break;
    case 'logistics':
      insight.message = "We need to identify your assigned polling booth.";
      insight.reason = `${reasoning.priorityReasoning} ${reasoning.consequenceReasoning}`;
      insight.suggestedAction = "Locate Booth →";
      break;
    case 'documents':
      insight.message = "Ensure you have a valid ID ready for the booth.";
      insight.reason = `Valid identification is mandatory. ${reasoning.consequenceReasoning}`;
      insight.suggestedAction = "Verify Documents →";
      break;
    case 'awareness':
      insight.message = "Let's confirm your local voting date and time.";
      insight.reason = `Election windows are strict. ${reasoning.consequenceReasoning}`;
      insight.suggestedAction = "Confirm Schedule →";
      break;
    default:
      insight.message = `You're just ${uncompleted.length} ${uncompleted.length === 1 ? 'step' : 'steps'} away from being fully ready.`;
      insight.reason = reasoning.priorityReasoning;
      insight.suggestedAction = "Fix This Now →";
  }

  // Handle first-time voter edge case
  if (userProfile.isFirstTimeVoter && readinessScore > 80) {
    insight.message = "You're almost there! Since it's your first time, let's practice.";
    insight.reason = "The simulator will walk you through exactly what happens once you enter the booth, reducing anxiety and errors.";
    insight.suggestedAction = "Start Simulation →";
    insight.route = "/simulation";
  }

  return insight;
};
