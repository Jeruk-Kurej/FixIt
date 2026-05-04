"use client";

import { useState, useEffect, useRef } from "react";
import { Send, X, User as UserIcon, MessageSquare, ShieldCheck, Clock, Move } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: string;
}

interface ChatUIProps {
  orderId: string;
  currentUserId: string;
  onClose: () => void;
  title: string;
  subtitle?: string;
}

export default function ChatUI({ orderId, currentUserId, onClose, title, subtitle }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: window.innerHeight - 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Draggable Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, content }),
      });
      fetchMessages();
    } catch (err) {}
  };

  return (
    <div 
      ref={chatRef}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        position: 'fixed',
      }}
      className={cn(
        "w-[400px] h-[550px] bg-slate-900 border border-slate-700/50 rounded-[2.5rem] flex flex-col z-[100] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden transition-shadow",
        isDragging ? "shadow-[0_40px_120px_rgba(0,0,0,0.8)] cursor-grabbing" : "shadow-2xl"
      )}
    >
      {/* Header (Draggable Area) */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-5 bg-slate-800 border-b border-slate-700 cursor-grab active:cursor-grabbing flex items-center justify-between select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/10">
            <UserIcon size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-2">
              {title}
              <Move size={12} className="text-slate-600" />
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{subtitle || "Teknisi"}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-xl text-slate-500 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef} 
        className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-950/20"
      >
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Memuat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
            <MessageSquare size={32} className="text-slate-700 mb-3" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mulai Percakapan</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-sm",
                  isMe ? "bg-orange-500 text-white rounded-tr-none" : "bg-slate-800 text-slate-300 rounded-tl-none border border-slate-700/30"
                )}>
                  {msg.content}
                </div>
                <span className="text-[8px] text-slate-700 font-black mt-1 px-1 uppercase">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area (Very Clear) */}
      <div className="p-5 bg-slate-800 border-t border-slate-700 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="w-full bg-slate-950 border-2 border-slate-700 rounded-2xl pl-5 pr-14 py-4 text-xs text-slate-100 focus:border-orange-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-900 disabled:text-slate-700 rounded-xl text-white transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-3 opacity-20">
          <ShieldCheck size={10} className="text-slate-500" />
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">Encrypted Connection</p>
        </div>
      </div>
    </div>
  );
}
