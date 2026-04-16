"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Globe,
  ChevronDown,
  Send,
  Image as ImageIcon,
  FileText,
  Layers,
  Sparkles,
  Cpu,
  Zap,
} from "lucide-react";
import { LuBrain } from "react-icons/lu";
import { PiLightbulbFilament } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface Model {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface AIInputProps {
  messages?: Message[];
  onSendMessage?: (text: string, modelId: string) => void;
  models?: Model[];
  backgroundText?: string;
  placeholder?: string;
  className?: string;
}

const DEFAULT_MODELS: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    icon: <PiLightbulbFilament className="h-4 w-4" />,
  },
  {
    id: "claude-3-5",
    name: "Claude 3.5 Sonnet",
    icon: <Sparkles className="h-4 w-4" />,
  },
  { id: "gemini-pro", name: "Gemini Pro", icon: <Cpu className="h-4 w-4" /> },
  { id: "llama-3.1", name: "Llama 3.1", icon: <Zap className="h-4 w-4" /> },
];

export const AiInput: React.FC<AIInputProps> = ({
  messages = [],
  onSendMessage = () => {},
  models = DEFAULT_MODELS,
  backgroundText = "Skiper Input 001",
  placeholder = "Ask anything...",
  className = "",
}) => {
  const hasMessages = messages.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden bg-background ${className}`}
    >
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 z-0 mb-10 flex items-end justify-center select-none"
          >
            <h1 className="text-xl font-bold text-muted-foreground/20 sm:text-5xl md:text-[150px]">
              {backgroundText}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <MessageList messages={messages} scrollRef={scrollRef} />

      <ChatInput
        models={models}
        placeholder={placeholder}
        hasMessages={hasMessages}
        onSend={onSendMessage}
      />
    </div>
  );
};

const MessageList = ({
  messages,
  scrollRef,
}: {
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!messages.length) return null;

  return (
    <div
      ref={scrollRef}
      className="z-10 flex w-full flex-1 flex-col items-center overflow-y-auto pt-6 sm:pt-10"
    >
      <div className="flex w-full max-w-3xl flex-col gap-4 px-3 pb-6 sm:px-4 sm:pb-10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg border px-3 py-2 text-sm font-medium shadow-sm sm:max-w-[80%] sm:px-4 sm:text-[15px] ${
                  msg.sender === "user"
                    ? "rounded-tr-none border-primary bg-primary text-primary-foreground"
                    : "rounded-tl-none border-border bg-card text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ChatInput = ({
  models,
  hasMessages,
  placeholder,
  onSend,
}: {
  models: Model[];
  hasMessages: boolean;
  placeholder: string;
  onSend: (text: string, modelId: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model>(
    models[0] ?? {
      id: "default",
      name: "Default",
      icon: <Sparkles className="h-4 w-4" />,
    },
  );
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDeepMindActive, setIsDeepMindActive] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend(inputValue, selectedModel.id);
    setInputValue("");
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`z-20 flex w-full justify-center px-3 py-4 sm:px-4 ${
        !hasMessages ? "flex-1 items-center" : "items-end"
      }`}
    >
      <motion.div
        layout
        className="w-full max-w-3xl rounded-lg border border-border bg-card p-3 shadow-sm"
      >
        <textarea
          ref={textAreaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
          className="mb-2 max-h-[180px] min-h-[40px] w-full resize-none bg-transparent px-1 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground sm:max-h-[200px] sm:min-h-[44px] sm:px-2 sm:text-base"
          rows={1}
        />

        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 p-2">
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto sm:gap-2">
            <AttachmentMenu />

            <motion.button
              layout
              onClick={() => setIsSearchActive(!isSearchActive)}
              className={`flex items-center gap-2 rounded-md border p-2 transition-all sm:p-2.5 ${
                isSearchActive
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <AnimatePresence>
                {isSearchActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="hidden overflow-hidden text-sm font-medium whitespace-nowrap sm:inline"
                  >
                    Search
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              layout
              onClick={() => setIsDeepMindActive(!isDeepMindActive)}
              className={`flex items-center gap-2 rounded-md border p-2 transition-all sm:p-2.5 ${
                isDeepMindActive
                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <LuBrain className="h-4 w-4 sm:h-5 sm:w-5" />
              <AnimatePresence>
                {isDeepMindActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="hidden overflow-hidden text-sm font-medium whitespace-nowrap sm:inline"
                  >
                    DeepMind
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`rounded-md p-2 transition-colors sm:p-3 ${
              inputValue.trim()
                ? "bg-primary text-primary-foreground hover:bg-[#cf2d56]"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ATTACHMENT_ITEMS = [
  { label: "Images", icon: ImageIcon },
  { label: "Documents", icon: FileText },
  { label: "Connect Apps", icon: Layers },
];

const AttachmentMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger className="group rounded-md border border-border bg-background p-2 text-muted-foreground sm:p-2.5">
      <Plus className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-45 sm:h-5 sm:w-5" />
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="start"
      side="bottom"
      className="mt-5.5 w-44 rounded-lg border border-border bg-popover p-2 shadow-sm sm:w-48"
    >
      {ATTACHMENT_ITEMS.map(({ label, icon: Icon }) => (
        <DropdownMenuItem
          key={label}
          className="flex items-center gap-2 p-2 text-sm font-medium text-foreground"
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const ModelSelector = ({
  models,
  selectedModel,
  onSelect,
}: {
  models: Model[];
  selectedModel: Model;
  onSelect: (model: Model) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border bg-background p-2 text-sm font-medium text-foreground sm:p-2.5">
      {selectedModel.icon}
      <span className="hidden md:inline">{selectedModel.name}</span>
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="start"
      side="bottom"
      className="mt-5.5 w-48 rounded-lg border border-border bg-popover shadow-sm p-1 sm:w-52"
    >
      {models.map((model) => (
        <DropdownMenuItem
          key={model.id}
          onClick={() => onSelect(model)}
          className="flex w-full items-center gap-2 rounded-sm p-2 text-sm font-medium text-foreground"
        >
          {model.icon}
          {model.name}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
