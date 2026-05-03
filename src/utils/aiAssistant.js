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
  const totalSteps = 5;
  const currentStepIndex = hurdles.findIndex(h => h.id === priority.id);
  const currentStepNumber = currentStepIndex + 1;
  const journeyContext = `You are currently at Step ${currentStepNumber} of ${totalSteps}: ${priority.act.split(' ')[0]}.`;

  let insight = {
    message: "",
    reason: "",
    suggestedAction: priority.act,
    route: "/hurdles",
    type: "warning",
    journeyContext,
    actions: [
      { label: "Open Guide", route: "/guide" },
      { label: "Take Next Step", route: "/hurdles" }
    ]
  };

  switch (priority.id) {
    case 'registration':
      insight.message = "You're at Step 1: Voter Registration.";
      insight.reason = `${reasoning.priorityReasoning} This is the legal foundation of your journey. Without registration, you cannot vote.`;
      insight.suggestedAction = "Register Now →";
      break;
    case 'verification':
      insight.message = "You've reached Step 2: List Verification.";
      insight.reason = `${reasoning.consequenceReasoning} This step ensures your name is actually on the electoral roll so you aren't turned away.`;
      insight.suggestedAction = "Check Voter List →";
      break;
    case 'logistics':
      insight.message = "Navigation Phase: Step 3 (Logistics).";
      insight.reason = `Knowing your exact booth location is critical. ${reasoning.priorityReasoning}`;
      insight.suggestedAction = "Locate Booth →";
      break;
    case 'documents':
      insight.message = "Step 4: ID Preparation.";
      insight.reason = `Strict identification is required for entry. ${reasoning.consequenceReasoning}`;
      insight.suggestedAction = "Verify Documents →";
      break;
    case 'awareness':
      insight.message = "The Final Mile: Step 5 (Awareness).";
      insight.reason = `Confirming your local voting window is the last step to readiness. ${reasoning.consequenceReasoning}`;
      insight.suggestedAction = "Confirm Schedule →";
      break;
    default:
      insight.message = `You're at Step ${currentStepNumber} of your election journey.`;
      insight.reason = reasoning.priorityReasoning;
      insight.suggestedAction = "Continue Journey →";
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
