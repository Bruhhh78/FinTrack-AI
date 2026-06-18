import { useState, useRef, useEffect } from 'react';
import { useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { aiAPI } from '../services/api';
import { Bot, User, Send, X, MessageCircle, Lock } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'How to start investing?',
  '50/30/20 budget rule',
  'Build emergency fund',
  'Compound interest tips',
];

const INITIAL_MESSAGE = {
  sender: 'bot',
  text: "Hi! I'm your FinTrack AI Advisor. Ask me about saving, budgeting, or investing.",
  timestamp: new Date(),
};

const AdvisorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const chatMutation = useMutation(
    (payload) => aiAPI.chat(payload).then((res) => res.data.reply),
    {
      onSuccess: (reply) => {
        setChatMessages((prev) => [...prev, { sender: 'bot', text: reply, timestamp: new Date() }]);
        setIsChatLoading(false);
      },
      onError: () => {
        toast.error('Failed to get response from AI advisor');
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: "I'm having trouble connecting to my knowledge base right now. Please check your internet connection or try again later.",
            timestamp: new Date(),
          },
        ]);
        setIsChatLoading(false);
      },
    }
  );

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText.trim();
    if (!text || isChatLoading) return;

    if (!textToSend) setInputText('');

    const updatedMessages = [...chatMessages, { sender: 'user', text, timestamp: new Date() }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    const chatHistory = updatedMessages.slice(-8, -1).map((msg) => ({
      sender: msg.sender,
      text: msg.text,
    }));

    chatMutation.mutate({ message: text, history: chatHistory });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className="advisor-chatbot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            />
            <motion.div
              className="advisor-chatbot-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            >
            <div className="advisor-chatbot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="advisor-chatbot-header-icon">
                  <Bot className="advisor-chatbot-header-bot-icon" />
                </div>
                <div>
                  <p className="advisor-chatbot-title">AI Advisor</p>
                  <p className="advisor-chatbot-subtitle">Savings & investing help</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="advisor-chatbot-close"
                aria-label="Close chat"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div className="advisor-chatbot-notice">
              <Lock style={{ width: 12, height: 12, color: '#a855f7', flexShrink: 0 }} />
              <span>Savings, budgeting & investments only</span>
            </div>

            <div className="advisor-chatbot-messages">
              {chatMessages.map((msg, idx) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={idx} className={`advisor-chatbot-row ${isBot ? 'bot' : 'user'}`}>
                    {isBot && (
                      <div className="advisor-chatbot-avatar bot">
                        <Bot style={{ width: 14, height: 14 }} />
                      </div>
                    )}
                    <div className={`advisor-chatbot-bubble ${isBot ? 'bot' : 'user'}`}>
                      {msg.text}
                    </div>
                    {!isBot && (
                      <div className="advisor-chatbot-avatar user">
                        <User style={{ width: 12, height: 12 }} />
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="advisor-chatbot-row bot">
                  <div className="advisor-chatbot-avatar bot">
                    <Bot style={{ width: 14, height: 14 }} />
                  </div>
                  <div className="advisor-chatbot-typing">
                    <span className="advisor-dot-blink" />
                    <span className="advisor-dot-blink" />
                    <span className="advisor-dot-blink" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="advisor-chatbot-footer">
              {chatMessages.length === 1 && !isChatLoading && (
                <div className="advisor-chatbot-chips">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="advisor-chatbot-chip"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="advisor-chatbot-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about saving or investing..."
                  className="advisor-chatbot-input"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  className="advisor-chatbot-send"
                  disabled={isChatLoading || !inputText.trim()}
                  aria-label="Send message"
                >
                  <Send style={{ width: 15, height: 15 }} />
                </button>
              </form>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`advisor-chatbot-fab${isOpen ? ' advisor-chatbot-fab--hidden' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close AI advisor chat' : 'Open AI advisor chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex' }}
          >
            {isOpen ? <X style={{ width: 22, height: 22 }} /> : <MessageCircle style={{ width: 22, height: 22 }} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default AdvisorChatbot;
