import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PrimaryButton } from './ui/StyledComponents';
import { useNavigate } from 'react-router-dom';

const OrbContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
`;

const ChatPanel = styled(motion.div)`
  width: 350px;
  background: rgba(11, 15, 26, 0.9);
  backdrop-filter: blur(25px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 20px rgba(124, 58, 237, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
`;

const ChatHeader = styled.div`
  padding: 1.2rem;
  background: rgba(124, 58, 237, 0.1);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled.div`
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const MessageBubble = styled.div`
  background: ${props => props.isUser ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: var(--text-main);
  padding: 0.8rem 1rem;
  border-radius: 16px;
  border-bottom-right-radius: ${props => props.isUser ? '4px' : '16px'};
  border-bottom-left-radius: ${props => props.isUser ? '16px' : '4px'};
  font-size: 0.95rem;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 85%;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChatInputWrapper = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid var(--glass-border);
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.02);
`;

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  color: white;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: var(--action-violet);
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.2);
  }
`;

const OrbToggle = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 70px;
  height: 70px;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const OrbCore = styled.div`
  position: absolute;
  inset: 12px;
  background: linear-gradient(135deg, var(--action-violet), #5b21b6);
  border-radius: 50%;
  box-shadow: 0 0 25px var(--action-violet);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const OrbPulse = styled(motion.div)`
  position: absolute;
  inset: 0;
  border: 2px solid var(--accent-cyan);
  border-radius: 50%;
`;

const ChipContainer = styled.div`
  padding: 0.8rem 1rem;
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  background: rgba(124, 58, 237, 0.05);
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Chip = styled.button`
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.2);
  color: var(--accent-cyan);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-cyan);
    color: var(--bg-primary);
    box-shadow: 0 0 15px var(--accent-cyan);
  }
`;

const InteractiveAction = styled.div`
  margin-top: 0.8rem;
`;

export default function AiOrb() {
  const { aiContext, toggleAiPanel, addChatMessage, hurdles, readinessScore, userProfile } = useStore();
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [aiContext.chatHistory, aiContext.isOpen]);

  const handleSend = (text) => {
    const message = text || input.trim();
    if (!message) return;

    addChatMessage({ role: 'user', content: message });
    setInput('');

    // Context-aware logic
    setTimeout(() => {
      const lower = message.toLowerCase();
      let responseContent = "I'm analyzing your request.";
      let actionBtn = null;

      const uncompletedHurdles = hurdles.filter(h => !h.completed);

      if (lower.includes('booth') || lower.includes('location')) {
        responseContent = "You can find your booth by checking the ECI Voter Portal.";
        actionBtn = { text: "Go to Hurdles", route: "/hurdles" };
      } else if (lower.includes('id') || lower.includes('document')) {
        responseContent = "Valid IDs include Voter ID, Aadhaar, PAN, Passport, and DL.";
        actionBtn = { text: "Go to Hurdles", route: "/hurdles" };
      } else if (lower.includes('register') || lower.includes('form')) {
        responseContent = "Register online via Form 6 on the Voter Helpline app.";
        actionBtn = { text: "Go to Hurdles", route: "/hurdles" };
      } else if (lower.includes('next') || lower.includes('what') || lower.includes('status')) {
        if (uncompletedHurdles.length > 0) {
          const priority = uncompletedHurdles[0];
          responseContent = `You are ${readinessScore}% ready. You need to focus on: ${priority.title}. Fix this first.`;
          actionBtn = { text: `Go to Hurdles`, route: "/hurdles" };
        } else {
          if (userProfile.isFirstTimeVoter) {
            responseContent = "You are fully prepared! Since this is your first time voting, I strongly recommend trying the Voting Simulator to understand the booth process.";
          } else {
            responseContent = "You are fully prepared! Ready to cast your vote? You can try the simulator for practice.";
          }
          actionBtn = { text: "Start Simulation", route: "/simulation" };
        }
      } else {
        if (uncompletedHurdles.length > 0) {
          responseContent = `I can help. You are currently ${readinessScore}% ready. Try asking what to do next.`;
        } else {
          responseContent = "I can help you navigate the process. Try asking about the simulator.";
        }
      }

      addChatMessage({ role: 'bot', content: responseContent, action: actionBtn });
    }, 600);
  };

  return (
    <OrbContainer>
      <AnimatePresence>
        {aiContext.isOpen && (
          <ChatPanel
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <ChatHeader>
              <h4 style={{ margin: 0, color: '#60a5fa' }}>VoteSense AI</h4>
              <button 
                onClick={toggleAiPanel}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                aria-label="Close Chat"
              >
                ✕
              </button>
            </ChatHeader>
            
            <ChatBody ref={chatBodyRef}>
              {aiContext.chatHistory.map((msg, idx) => (
                <MessageBubble key={idx} isUser={msg.role === 'user'}>
                  {msg.content}
                  {msg.action && (
                    <InteractiveAction>
                      <PrimaryButton 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => navigate(msg.action.route)}
                      >
                        {msg.action.text}
                      </PrimaryButton>
                    </InteractiveAction>
                  )}
                </MessageBubble>
              ))}
            </ChatBody>

            <ChipContainer>
              <Chip onClick={() => handleSend("What should I do next?")}>What's next?</Chip>
              <Chip onClick={() => handleSend("Where is my booth?")}>Find Booth</Chip>
              <Chip onClick={() => handleSend("What documents do I need?")}>Documents</Chip>
            </ChipContainer>

            <ChatInputWrapper>
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                aria-label="Chat Message Input"
              />
              <PrimaryButton 
                onClick={() => handleSend()} 
                style={{ padding: '0.5rem 1rem' }}
                aria-label="Send Message"
              >
                ➜
              </PrimaryButton>
            </ChatInputWrapper>
          </ChatPanel>
        )}
      </AnimatePresence>

      <OrbToggle onClick={toggleAiPanel} aria-label="Toggle AI Guide" aria-expanded={aiContext.isOpen}>
        <OrbCore aria-hidden="true">🧠</OrbCore>
        <OrbPulse
          animate={{ scale: [1, 2], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
          aria-hidden="true"
        />
      </OrbToggle>
    </OrbContainer>
  );
}
