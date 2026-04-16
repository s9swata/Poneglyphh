"use client";

import { useState } from "react";
import { Plus, MessageSquare, Settings } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

export function ChatSidebar() {
  const [chats, _setChats] = useState<ChatHistoryItem[]>([
    { id: "1", title: "Volunteer trends by region", date: "Today" },
    { id: "2", title: "NGO growth over time", date: "Yesterday" },
    { id: "3", title: "Impact metrics", date: "2 days ago" },
  ]);
  const [selectedChat, setSelectedChat] = useState<string | null>("1");

  return (
    <div className="w-64 bg-grey-4 border-r border-grey-3 flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-3 border-b border-grey-3">
        <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-grey-3 rounded-lg text-sm font-medium text-black hover:border-grey-2 transition-colors">
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 pb-2">
          <span className="text-[10px] font-medium text-grey-2 uppercase tracking-wider">
            Recent Chats
          </span>
        </div>
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
              selectedChat === chat.id
                ? "bg-white text-black"
                : "text-grey-1 hover:bg-white hover:text-black"
            }`}
          >
            <MessageSquare size={14} className="shrink-0" />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-grey-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-grey-1 hover:text-black transition-colors">
          <Settings size={14} />
          Settings
        </button>
      </div>
    </div>
  );
}
