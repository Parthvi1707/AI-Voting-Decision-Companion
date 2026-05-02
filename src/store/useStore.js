import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialRoadmap = [
  { id: 'analysis', title: "Analysis", desc: "System diagnosis complete.", status: "done" },
  { id: 'registration', title: "Registration", desc: "Action Required", status: "active" },
  { id: 'verification', title: "Verification", desc: "Pending", status: "pending" },
  { id: 'logistics', title: "Logistics", desc: "Pending", status: "pending" },
  { id: 'documents', title: "Documents", desc: "Pending", status: "pending" },
  { id: 'awareness', title: "Awareness", desc: "Pending", status: "pending" },
];

const initialHurdles = [
  { id: 'registration', title: "Voter Registration Pending", act: "Register Now", impact: "You cannot vote without this", time: "5 mins", completed: false },
  { id: 'verification', title: "Name not verified in roll", act: "Check Voter List", impact: "Risk of rejection at booth", time: "2 mins", completed: false },
  { id: 'logistics', title: "Booth location unknown", act: "Find Your Booth", impact: "You won't know where to go", time: "1 min", completed: false },
  { id: 'documents', title: "No valid ID detected", act: "View Required IDs", impact: "Required for booth entry", time: "3 mins", completed: false },
  { id: 'awareness', title: "Voting date not confirmed", act: "Check Election Dates", impact: "Risk of missing the election", time: "1 min", completed: false }
];

// Defensive defaults
const DEFAULT_STATE = {
  userProfile: {
    name: 'Guest',
    isLoggedIn: false,
    isFirstTimeVoter: false,
    hasCompletedOnboarding: false
  },
  readinessScore: 0,
  estimatedTimeRemaining: 12,
  hurdles: initialHurdles,
  roadmapSteps: initialRoadmap,
  simulationState: {
    currentStep: 0,
    completed: false
  },
  aiContext: {
    isOpen: false,
    chatHistory: [
      { role: 'bot', content: "Hi! I'm your AI guide. Need help navigating the election process?" }
    ]
  }
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      // Validation Layer
      validateUser: (profile) => {
        if (!profile || typeof profile.name !== 'string') return { isValid: false, error: 'Invalid profile data' };
        const cleanName = profile.name.trim().replace(/[<>]/g, '');
        if (cleanName.length < 2) return { isValid: false, error: 'Name too short' };
        return { isValid: true, sanitizedName: cleanName };
      },

      // Sanitization Helper
      sanitizeInput: (text) => {
        if (typeof text !== 'string') return '';
        return text.trim().replace(/[<>]/g, '');
      },

      // Actions
      setUserProfile: (name) => {
        const validation = get().validateUser({ name });
        if (!validation.isValid) return;
        
        set((state) => ({ 
          userProfile: { ...state.userProfile, name: validation.sanitizedName, isLoggedIn: true } 
        }));
      },
      
      submitOnboarding: (answers) => {
        if (!answers || typeof answers !== 'object') return;
        
        set((state) => {
          const newHurdles = state.hurdles.map(h => ({
            ...h,
            completed: answers[h.id] !== undefined ? !!answers[h.id] : h.completed
          }));

          const newRoadmap = state.roadmapSteps.map(r => ({
            ...r,
            status: answers[r.id] ? 'done' : r.status,
            desc: answers[r.id] ? 'Verified during onboarding' : r.desc
          }));
          
          const completedCount = newHurdles.filter(h => h.completed).length;
          const readinessScore = Math.round((completedCount / newHurdles.length) * 100);
          
          const estimatedTimeRemaining = newHurdles
            .filter(h => !h.completed)
            .reduce((acc, h) => acc + parseInt(h.time || 0), 0);

          return {
            userProfile: {
              ...state.userProfile,
              isFirstTimeVoter: !!answers.firstTime,
              hasCompletedOnboarding: true
            },
            hurdles: newHurdles,
            roadmapSteps: newRoadmap,
            readinessScore,
            estimatedTimeRemaining
          };
        });
      },
      
      toggleAiPanel: () => set((state) => ({
        aiContext: { ...state.aiContext, isOpen: !state.aiContext.isOpen }
      })),

      addChatMessage: (msg) => {
        if (!msg || !msg.content) return;
        const sanitizedContent = get().sanitizeInput(msg.content);
        if (!sanitizedContent) return;
        
        set((state) => ({
          aiContext: { 
            ...state.aiContext, 
            chatHistory: [...state.aiContext.chatHistory, { ...msg, content: sanitizedContent }] 
          }
        }));
      },

      completeHurdle: (id) => {
        if (!id) return;
        
        set((state) => {
          const newHurdles = state.hurdles.map(h => 
            h.id === id ? { ...h, completed: true } : h
          );
          
          const completedCount = newHurdles.filter(h => h.completed).length;
          const readinessScore = Math.round((completedCount / newHurdles.length) * 100);

          const newRoadmap = state.roadmapSteps.map(step => 
            step.id === id ? { ...step, status: 'done', desc: 'Step Verified' } : step
          );

          const estimatedTimeRemaining = newHurdles
            .filter(h => !h.completed)
            .reduce((acc, h) => acc + parseInt(h.time || 0), 0);

          return { 
            hurdles: newHurdles, 
            readinessScore,
            roadmapSteps: newRoadmap,
            estimatedTimeRemaining 
          };
        });
      },

      setSimulationStep: (step) => {
        if (typeof step !== 'number' || step < 0 || step > 3) return;
        set((state) => ({
          simulationState: { ...state.simulationState, currentStep: step }
        }));
      },

      completeSimulation: () => set((state) => ({
        simulationState: { ...state.simulationState, completed: true }
      })),

        roadmapSteps: initialRoadmap,
        simulationState: { currentStep: 0, completed: false },
        aiContext: {
          isOpen: false,
          chatHistory: [
            { role: 'bot', content: "Hi! I'm your AI guide. Need help navigating the election process?" }
          ],
          priorityAction: null
        }
      })
    }),
    {
      name: 'votesense-storage', // unique name for localStorage key
    }
  )
);
