import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../../api/axiosInstance';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1','') 
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

const ChatWidget = ({ room = 'global' }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    // Load recent history
    let mounted = true;
    axiosInstance.get(`/chat/rooms/${room}/messages`).then((res) => {
      if (mounted && res.data?.data?.messages) {
        setMessages(res.data.data.messages.map((m) => ({
          room: m.room,
          text: m.text,
          sender: { name: m.sender?.name || 'Anon' },
          createdAt: m.createdAt,
        })));
      }
    }).catch(() => {});

    // Attach token in auth for server-side verification (optional)
    const token = sessionStorage.getItem('edusphere_token') || localStorage.getItem('edusphere_token');
    const s = io(SOCKET_URL, { auth: { token }, path: '/socket.io' });
    setSocket(s);

    s.on('connect', () => {
      s.emit('joinRoom', room);
    });

    s.on('chat.message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      mounted = false;
      s.disconnect();
    };
  }, [room]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit('chat.message', { room, text });
    setText('');
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-3">
      <div ref={listRef} className="h-48 overflow-y-auto space-y-2 mb-2">
        {messages.map((m, i) => (
          <div key={i} className="text-xs">
            <strong className="text-brand-400">{m.sender?.name || 'Anon'}:</strong>
            <span className="ml-2 text-slate-200">{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message..." className="flex-1 p-2 rounded bg-slate-800 text-slate-100 text-xs" />
        <button className="px-3 py-1 rounded bg-brand-600 text-white text-xs">Send</button>
      </form>
    </div>
  );
};

export default ChatWidget;