// @author: fatima bashir
'use client';
import { Send, Sparkles, Brain, Trash2 } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';
import { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const { theme, colors } = useTheme();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [userMessages, aiResponses]);

  // Auto-scroll when loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  const handleClearChat = () => {
    setShowClearConfirm(false);
    setUserMessages([]);
    setAiResponses([]);
    setShowWelcome(true);
    localStorage.setItem('chatCleared', 'true');
    setTimeout(scrollToBottom, 100); // Scroll after state updates
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    const currentMessage = inputMessage.trim();
    
    // Build conversation history
    const conversationHistory = [];
    for (let i = 0; i < userMessages.length; i++) {
      conversationHistory.push({ role: 'user', content: userMessages[i] });
      if (aiResponses[i]) {
        conversationHistory.push({ role: 'assistant', content: aiResponses[i] });
      }
    }
    
    setUserMessages(prev => [...prev, currentMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Scroll to show user message immediately
    setTimeout(scrollToBottom, 50);
    
    try {
      console.log('🚀 Frontend: Sending message:', currentMessage);
      console.log('📚 Frontend: Conversation history:', conversationHistory);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          conversation_history: conversationHistory
        })
      });
      
      console.log('📡 Frontend: Response status:', response.status);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('✅ Frontend: API response:', data);
      console.log('📤 Frontend: AI response status:', data.status);
      
      setAiResponses(prev => [...prev, data.response]);
      
    } catch (error) {
      console.error('❌ Frontend: Error sending message:', error);
      const fallbackResponse = "I'm experiencing technical difficulties. Please try refreshing the page or asking your question again. I'm here to help with career advice, resume tips, interview prep, and more!";
      setAiResponses(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div style={{ padding: '16px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', padding: '0 16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>
          AI Career Mentor
        </h1>
        <p style={{ fontSize: '16px', color: colors.text, opacity: '0.7' }}>
          Get personalized career advice and guidance 24/7
        </p>
      </div>

      {/* Chat Container */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        
        {/* Chat Header */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${colors.cardBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px',
                background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(248, 250, 252, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Brain size={20} style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
              </div>
              <div>
                <h2 style={{ fontWeight: '600', color: colors.text, marginBottom: '4px' }}>Mentorly AI</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#059669' }}>
                  <span style={{ width: '8px', height: '8px', background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)', borderRadius: '50%' }}></span>
                  Online
                </div>
              </div>
            </div>
            
            {/* Clear Button ONLY */}
            <div>
              {showClearConfirm ? (
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <span style={{fontSize: '14px', color: colors.text, opacity: '0.7'}}>Clear all messages?</span>
                  <button onClick={handleClearChat} style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid #dc2626',
                    background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)',
                    color: '#dc2626', fontSize: '12px', fontWeight: '500', cursor: 'pointer'
                  }}>Yes, Clear</button>
                  <button onClick={() => setShowClearConfirm(false)} style={{
                    padding: '8px 12px', borderRadius: '8px',
                    border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                    background: theme === 'dark' ? 'rgba(148, 163, 184, 0.05)' : 'rgba(248, 250, 252, 0.8)',
                    color: theme === 'dark' ? '#cbd5e1' : '#64748b', fontSize: '12px', fontWeight: '500', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setShowClearConfirm(true)} style={{
                  padding: '8px', borderRadius: '8px',
                  border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                  background: theme === 'dark' ? 'rgba(148, 163, 184, 0.05)' : 'rgba(248, 250, 252, 0.8)',
                  color: theme === 'dark' ? '#cbd5e1' : '#64748b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} title="Clear chat history">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: '1', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Welcome message - shows by default, hidden only when explicitly cleared */}
          {showWelcome && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '32px', height: '32px',
                background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(248, 250, 252, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0'
              }}>
                <Sparkles size={16} style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
              </div>
              <div style={{flex: '1'}}>
                <div style={{
                  padding: '16px', borderRadius: '16px',
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
                  border: `1px solid ${colors.cardBorder}`, maxWidth: '85%'
                }}>
                  <p style={{ color: colors.text, lineHeight: '1.6', margin: '0' }}>
                    👋 Hi there! I'm Mentorly, your personalized AI career mentor. How can I help you today? ✨
                  </p>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Just now</div>
              </div>
            </div>
          )}

          {/* User Messages & AI Responses */}
          {userMessages.map((message, index) => (
            <div key={`conversation-${index}`}>
              {/* User Message */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '16px',
                justifyContent: 'flex-end', marginBottom: '16px'
              }}>
                <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    padding: '16px', borderRadius: '16px',
                    background: theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(241, 245, 249, 0.9)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.4)'}`,
                    color: colors.text, maxWidth: '70%'
                  }}>
                    <p style={{ lineHeight: '1.6', margin: '0' }}>{message}</p>
                  </div>
                </div>
                <div style={{
                  width: '32px', height: '32px',
                  background: theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 252, 231, 0.8)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0'
                }}>
                  <span style={{ color: theme === 'dark' ? '#4ade80' : '#059669', fontWeight: '600', fontSize: '12px' }}>F</span>
                </div>
              </div>

              {/* AI Response */}
              {aiResponses[index] && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(248, 250, 252, 0.8)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0'
                  }}>
                    <Sparkles size={16} style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
                  </div>
                  <div style={{flex: '1'}}>
                    <div style={{
                      padding: '16px', borderRadius: '16px',
                      background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
                      border: `1px solid ${colors.cardBorder}`, maxWidth: '85%'
                    }}>
                      <p style={{ color: colors.text, lineHeight: '1.6', margin: '0', whiteSpace: 'pre-line' }}>
                        {aiResponses[index]}
                      </p>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Just now</div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && index === userMessages.length - 1 && !aiResponses[index] && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(248, 250, 252, 0.8)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0'
                  }}>
                    <Sparkles size={16} style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
                  </div>
                  <div style={{flex: '1'}}>
                    <div style={{
                      padding: '16px', borderRadius: '16px',
                      background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
                      border: `1px solid ${colors.cardBorder}`, maxWidth: '85%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.text }}>
                        <div style={{
                          width: '16px', height: '16px', border: `2px solid ${colors.text}`,
                          borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
                        }}></div>
                        Mentorly is thinking...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ padding: '24px', borderTop: `1px solid ${colors.cardBorder}` }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: '1', position: 'relative' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about career transitions, skill development, networking, salary negotiation..."
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '16px',
                  border: `2px solid ${colors.cardBorder}`,
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  color: colors.text, fontSize: '16px', outline: 'none'
                }}
              />
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ''}
              style={{
                padding: '16px', borderRadius: '16px',
                background: inputMessage.trim() === '' 
                  ? (theme === 'dark' ? 'rgba(148, 163, 184, 0.05)' : 'rgba(241, 245, 249, 0.4)')
                  : (theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(241, 245, 249, 0.8)'),
                border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`,
                cursor: inputMessage.trim() === '' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: inputMessage.trim() === '' ? '0.5' : '1'
              }}>
              <Send size={20} style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setInputMessage('Can you give me some resume tips?')} style={{
              padding: '8px 16px', background: theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)'}`,
              borderRadius: '20px', color: theme === 'dark' ? '#cbd5e1' : '#64748b',
              fontSize: '14px', cursor: 'pointer', fontWeight: '500'
            }}>Resume tips</button>
            <button onClick={() => setInputMessage('I want to change my career. How should I approach a career transition?')} style={{
              padding: '8px 16px', background: theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)'}`,
              borderRadius: '20px', color: theme === 'dark' ? '#cbd5e1' : '#64748b',
              fontSize: '14px', cursor: 'pointer', fontWeight: '500'
            }}>Career transition</button>
            <button onClick={() => setInputMessage('What are some effective networking strategies for career growth?')} style={{
              padding: '8px 16px', background: theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)'}`,
              borderRadius: '20px', color: theme === 'dark' ? '#cbd5e1' : '#64748b',
              fontSize: '14px', cursor: 'pointer', fontWeight: '500'
            }}>Networking strategies</button>
            <button onClick={() => setInputMessage('How can I negotiate my salary effectively?')} style={{
              padding: '8px 16px', background: theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)'}`,
              borderRadius: '20px', color: theme === 'dark' ? '#cbd5e1' : '#64748b',
              fontSize: '14px', cursor: 'pointer', fontWeight: '500'
            }}>Salary negotiation</button>
          </div>
        </div>
      </div>
    </div>
  );
}