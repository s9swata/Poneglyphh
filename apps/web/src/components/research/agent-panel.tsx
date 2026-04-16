'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@Poneglyph/ui/components/button';
import { Input } from '@Poneglyph/ui/components/input';
import { 
  Paperclip, 
  Send, 
  Minimize2, 
  Maximize2, 
  X,
  FileText,
  Upload
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: File[];
  timestamp: Date;
}

interface AgentPanelProps {
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function AgentPanel({ onMinimize, isMinimized = false }: AgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your research assistant. Upload a dataset or start drawing on the whiteboard, and I can help you analyze and visualize your survey data.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate agent response (replace with actual API call)
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I received your message. You can ask me about your data, request visualizations, or anything about the whiteboard content.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Add file to the last user message or create a new one
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Uploaded ${files.length} file(s)`,
        files: Array.from(files),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate processing
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I\'ve processed your uploaded file(s). I can see the data now. What would you like to visualize or analyze?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);
      }, 1500);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Uploaded ${files.length} file(s) via drag & drop`,
        files: Array.from(files),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[400px] bg-background border-t shadow-lg flex flex-col z-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium text-sm">Research Agent</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMinimize}>
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.files && msg.files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 text-xs bg-background/20 px-2 py-1 rounded"
                    >
                      <FileText className="h-3 w-3" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <span className="text-xs opacity-50 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-primary">
            <Upload className="h-8 w-8" />
            <span>Drop files to upload</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".csv,.json,.xlsx,.xls"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the agent..."
            className="flex-1"
          />
          <Button size="icon" className="shrink-0" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AgentPanelMinimized({ onExpand }: { onExpand: () => void }) {
  return (
    <button
      onClick={onExpand}
      className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors z-50"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}