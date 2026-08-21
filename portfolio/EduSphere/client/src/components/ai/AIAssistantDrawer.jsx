import React, { useState, useEffect } from 'react';
import { askAITutor, saveConversation, fetchConversations } from '../../api/aiApi';
import { BrainCircuit, X, Send, Sparkles, Loader2, Bot, Trash2, HelpCircle } from 'lucide-react';

const AIAssistantDrawer = ({ isOpen, onClose, lessonTitle, courseTitle }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your EduSphere AI Study Partner. Ask me any question about **${lessonTitle || 'this lesson'}** or key technical concepts!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState([
    'Can you explain this with a short code example?',
    'What are common security best practices here?',
    'How does this integrate into our project architecture?',
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const loadPastHistory = async () => {
      try {
        const res = await fetchConversations();
        if (res.data?.conversations && res.data.conversations.length > 0) {
          const match = res.data.conversations.find(
            (c) => c.lessonTitle === lessonTitle || c.courseTitle === courseTitle
          );
          if (match && match.messages?.length > 0) {
            setMessages(match.messages);
          }
        }
      } catch (err) {
        // Fallback silently if history unavailable
      }
    };
    loadPastHistory();
  }, [isOpen, lessonTitle, courseTitle]);

  if (!isOpen) return null;

  const handleSendQuery = async (userText) => {
    if (!userText || !userText.trim() || loading) return;

    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await askAITutor({
        question: userText,
        lessonTitle,
        courseTitle,
      });

      if (res.data?.answer) {
        const aiText = res.data.answer;
        setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
        if (res.data.suggestedFollowUps) {
          setSuggestedFollowUps(res.data.suggestedFollowUps);
        }

        // Save conversation
        try {
          await saveConversation({
            lessonTitle,
            courseTitle,
            messages: [
              { sender: 'user', text: userText },
              { sender: 'ai', text: aiText },
            ],
          });
        } catch (e) {}
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered a connection issue. Please try asking again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(query);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'ai',
        text: `Conversation cleared. Ask me anything about **${lessonTitle || 'this lesson'}**!`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                EduSphere AI Tutor
                <span className="px-1.5 py-0.5 rounded bg-purple-950 text-[10px] text-purple-300 border border-purple-800">Active AI</span>
              </h3>
              <p className="text-[11px] text-purple-300 truncate max-w-[200px]">
                {lessonTitle || courseTitle || 'Interactive Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="p-4 flex-grow overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none font-medium'
                    : 'glass-card text-slate-200 border border-slate-800 rounded-bl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-400 italic">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              EduSphere AI is generating answer...
            </div>
          )}
        </div>

        {/* Quick Follow-up Chips */}
        {suggestedFollowUps.length > 0 && !loading && (
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex-shrink-0">Prompt Ideas:</span>
            {suggestedFollowUps.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-700 text-[11px] text-slate-300 hover:text-purple-200 transition-all flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Query Input */}
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-800 glass-panel">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask AI Tutor a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AIAssistantDrawer;
