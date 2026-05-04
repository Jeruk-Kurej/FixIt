"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatUI from "./ChatUI";

interface ChatButtonProps {
  orderId: string;
  currentUserId: string;
  recipientName: string;
}

export default function ChatButton({ orderId, currentUserId, recipientName }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-300 transition-all hover:text-orange-400 group"
      >
        <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
        Chat
      </button>

      {isOpen && (
        <ChatUI
          orderId={orderId}
          currentUserId={currentUserId}
          onClose={() => setIsOpen(false)}
          title={`Chat: ${recipientName}`}
        />
      )}
    </>
  );
}
