import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Trash2, AlertCircle, Bot, User } from 'lucide-react';
import type { ChatMessage } from '../hooks/useAiChat';
import './AiChatPanel.css';

interface AiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  retryAfterSeconds: number | null;
  onSendMessage: (message: string) => void;
  onClearHistory: () => void;
  problemTitle: string;
}

/**
 * Renders basic markdown formatting for AI responses.
 * 
 * Why not use a library like react-markdown?
 * To avoid adding another dependency for a relatively simple use case.
 * We handle: bold, inline code, code blocks, lists, and paragraphs.
 * For a production app, you'd use react-markdown + remark-gfm.
 */
function renderMarkdown(text: string): React.ReactNode {
  // Split into code blocks and non-code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    // Code blocks
    if (part.startsWith('```') && part.endsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const lang = lines[0]?.trim() || '';
      const code = (lang ? lines.slice(1) : lines).join('\n').trim();
      return (
        <pre key={i}>
          <code>{code}</code>
        </pre>
      );
    }

    // Process inline formatting
    return part.split('\n').map((line, j) => {
      // Empty lines = paragraph break
      if (line.trim() === '') return <br key={`${i}-${j}`} />;

      // Bullet points
      if (line.match(/^[\s]*[-*]\s/)) {
        const content = line.replace(/^[\s]*[-*]\s/, '');
        return (
          <div key={`${i}-${j}`} style={{ paddingLeft: '1rem', marginBottom: '0.2rem' }}>
            • {renderInline(content)}
          </div>
        );
      }

      // Numbered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        const match = line.match(/^[\s]*(\d+)\.\s(.*)/);
        if (match) {
          return (
            <div key={`${i}-${j}`} style={{ paddingLeft: '1rem', marginBottom: '0.2rem' }}>
              {match[1]}. {renderInline(match[2])}
            </div>
          );
        }
      }

      return <p key={`${i}-${j}`}>{renderInline(line)}</p>;
    });
  });
}

/** Handles **bold** and `inline code` within a line. */
function renderInline(text: string): React.ReactNode {
  const tokens = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={i}>{token.slice(1, -1)}</code>;
    }
    return token;
  });
}

const AiChatPanel: React.FC<AiChatPanelProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  error,
  retryAfterSeconds,
  onSendMessage,
  onClearHistory,
  problemTitle,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  if (!isOpen) return null;

  const suggestions = [
    `I'm stuck on "${problemTitle}". Can you give me a hint?`,
    'What data structure should I use here?',
    'Can you analyze my current code for bugs?',
    'What is the optimal time complexity for this problem?',
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="ai-chat-backdrop" onClick={onClose} />

      {/* Chat Panel */}
      <div className="ai-chat-panel">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <div className="ai-chat-header-icon">
              <Sparkles size={16} />
            </div>
            <div className="ai-chat-header-info">
              <h3>TidyBit AI</h3>
              <span>DSA Tutor • {problemTitle}</span>
            </div>
          </div>
          <div className="ai-chat-header-actions">
            {messages.length > 0 && (
              <button
                className="ai-chat-header-btn"
                onClick={onClearHistory}
                title="Clear chat history"
              >
                <Trash2 size={15} />
              </button>
            )}
            <button className="ai-chat-header-btn" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages">
          {messages.length === 0 && !isLoading ? (
            <div className="ai-chat-welcome">
              <div className="ai-chat-welcome-icon">
                <Sparkles size={24} />
              </div>
              <h4>Need help solving this?</h4>
              <p>
                I'm your DSA tutor. I'll guide you with hints and explanations
                — not just give you the answer. Ask me anything!
              </p>
              <div className="ai-chat-suggestions">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="ai-suggestion-btn"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`ai-chat-msg ${msg.role}`}>
                  <div className="ai-msg-avatar">
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className="ai-msg-bubble">
                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="ai-loading-indicator">
                  <div className="ai-msg-avatar" style={{ background: 'var(--accent-gradient)' }}>
                    <Bot size={14} color="white" />
                  </div>
                  <div className="ai-loading-dots">
                    <div className="ai-loading-dot" />
                    <div className="ai-loading-dot" />
                    <div className="ai-loading-dot" />
                  </div>
                  <span className="ai-loading-text">Thinking...</span>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="ai-chat-error">
                  <AlertCircle size={16} className="ai-chat-error-icon" />
                  <span>{error}</span>
                  {!retryAfterSeconds && (
                    <button
                      className="ai-retry-btn"
                      onClick={() => {
                        // Resend the last user message
                        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                        if (lastUserMsg) onSendMessage(lastUserMsg.content);
                      }}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ai-chat-input-area">
          {retryAfterSeconds && (
            <div className="ai-rate-limit-warning">
              ⏳ Rate limited — please wait {retryAfterSeconds}s before sending
            </div>
          )}
          <div className="ai-chat-input-row">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this problem..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="ai-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              title="Send message (Enter)"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="ai-chat-input-hint">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </>
  );
};

export default AiChatPanel;
