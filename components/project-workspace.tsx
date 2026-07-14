"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  FileText,
  File,
  Image,
  Music,
  PanelLeftOpen,
  PanelLeftClose,
  MoreHorizontal,
  MessageSquare,
  Folder,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ListTodo,
  Circle,
  CheckCircle2,
  Archive,
  Trash2,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "pdf" | "txt" | "doc" | "image" | "audio";
  size: string;
  pages?: number;
  uploadedAt: string;
}

interface FileFolder {
  id: string;
  name: string;
  files: FileItem[];
}

interface Playground {
  id: string;
  name: string;
  preview: string;
  timestamp: string;
}

const mockFileFolders: FileFolder[] = [
  {
    id: "ff1",
    name: "Design Assets",
    files: [
      { id: "f1", name: "Hero Mockup.png", type: "image", size: "3.8 MB", uploadedAt: "3 days ago" },
      { id: "f2", name: "Wireframes.png", type: "image", size: "2.1 MB", uploadedAt: "2 weeks ago" },
    ],
  },
  {
    id: "ff2",
    name: "Research Docs",
    files: [
      { id: "f3", name: "Project Requirements.pdf", type: "pdf", size: "2.4 MB", pages: 12, uploadedAt: "2 hours ago" },
      { id: "f4", name: "Competitive Analysis.doc", type: "doc", size: "1.1 MB", pages: 24, uploadedAt: "2 days ago" },
      { id: "f5", name: "User Interview.mp3", type: "audio", size: "12.6 MB", uploadedAt: "1 week ago" },
    ],
  },
  {
    id: "ff3",
    name: "Guides",
    files: [
      { id: "f6", name: "Style Guide.pdf", type: "pdf", size: "5.2 MB", pages: 32, uploadedAt: "1 week ago" },
      { id: "f7", name: "Design Brief.txt", type: "txt", size: "48 KB", uploadedAt: "Yesterday" },
    ],
  },
];

const mockPlaygrounds: Playground[] = [
  { id: "p1", name: "Competitor analysis", preview: "Here are the key findings from the competitor research...", timestamp: "10 min ago" },
  { id: "p2", name: "Color palette exploration", preview: "I've generated 5 palette options based on the brand guidelines...", timestamp: "Yesterday" },
  { id: "p3", name: "Typography review", preview: "The new heading scale improves readability by 23%...", timestamp: "2 days ago" },
  { id: "p4", name: "User personas", preview: "Based on the interview data, we identified three core personas...", timestamp: "2 hours ago" },
  { id: "p5", name: "Stakeholder review notes", preview: "Main concerns were around the navigation hierarchy...", timestamp: "3 days ago" },
];

const typeIcons: Record<FileItem["type"], typeof FileText> = {
  pdf: FileText,
  txt: FileText,
  doc: File,
  image: Image,
  audio: Music,
};

const typeColors: Record<FileItem["type"], string> = {
  pdf: "text-red-400 bg-red-500/10",
  txt: "text-blue-400 bg-blue-500/10",
  doc: "text-sky-400 bg-sky-500/10",
  image: "text-emerald-400 bg-emerald-500/10",
  audio: "text-violet-400 bg-violet-500/10",
};

interface Tab {
  id: string;
  name: string;
  type: "playground" | "file";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Todo {
  id: string;
  text: string;
  status: "pending" | "in_progress" | "completed" | "archived";
}

let tabCounter = 0;
function nextTabId() {
  tabCounter++;
  return `tab-${tabCounter}`;
}

let msgCounter = 0;
function nextMsgId() {
  msgCounter++;
  return `msg-${msgCounter}`;
}

let todoCounter = 0;
function nextTodoId() {
  todoCounter++;
  return `todo-${todoCounter}`;
}

const FILES_WIDTH = 280;

export function ProjectWorkspace({ projectName }: { projectName: string }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [filesOpen, setFilesOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<"files" | "playgrounds">("files");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoOpen, setTodoOpen] = useState(false);
  const [todoInput, setTodoInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(mockFileFolders.map((f) => f.id))
  );

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };
  const [todoMenuPos, setTodoMenuPos] = useState({ top: 0, right: 0 });
  const todoButtonRef = useRef<HTMLButtonElement>(null);
  const todoMenuRef = useRef<HTMLDivElement>(null);
  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTabId]);

  useEffect(() => {
    if (!todoOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        todoMenuRef.current &&
        !todoMenuRef.current.contains(e.target as Node) &&
        todoButtonRef.current &&
        !todoButtonRef.current.contains(e.target as Node)
      ) {
        setTodoOpen(false);
        setIsAdding(false);
        setTodoInput("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [todoOpen]);

  const addPlaygroundTab = () => {
    const newTab: Tab = {
      id: nextTabId(),
      name: `Playground ${tabs.length + 1}`,
      type: "playground",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setMessages((prev) => ({
      ...prev,
      [newTab.id]: [
        { id: nextMsgId(), role: "assistant", content: "Hello! I'm your AI assistant. Ask me anything about your project files and I'll help you out." },
      ],
    }));
  };

  const addFileTab = (fileName: string) => {
    const existing = tabs.find((t) => t.name === fileName && t.type === "file");
    if (existing) {
      setActiveTabId(existing.id);
      return;
    }
    const newTab: Tab = {
      id: nextTabId(),
      name: fileName,
      type: "file",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const sendMessage = () => {
    if (!activeTabId || !inputValue.trim()) return;
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab || activeTab.type !== "playground") return;

    const userMsg: Message = { id: nextMsgId(), role: "user", content: inputValue.trim() };
    setMessages((prev) => ({
      ...prev,
      [activeTabId]: [...(prev[activeTabId] || []), userMsg],
    }));
    setInputValue("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: nextMsgId(),
        role: "assistant",
        content: "This is a mock response. In the real version, I would analyze your files and provide a helpful answer based on your project context.",
      };
      setMessages((prev) => ({
        ...prev,
        [activeTabId]: [...(prev[activeTabId] || []), aiMsg],
      }));
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const removeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        const idx = prev.findIndex((t) => t.id === tabId);
        const newActive = next[Math.min(idx, next.length - 1)];
        setActiveTabId(newActive?.id ?? null);
      }
      return next;
    });
    setMessages((prev) => {
      const next = { ...prev };
      delete next[tabId];
      return next;
    });
  };

  const addTodo = () => {
    if (!todoInput.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: nextTodoId(), text: todoInput.trim(), status: "pending" },
    ]);
    setTodoInput("");
    todoInputRef.current?.focus();
  };

  const updateTodoStatus = (id: string, status: Todo["status"]) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const hasTabs = tabs.length > 0;
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeMessages = activeTabId ? messages[activeTabId] || [] : [];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <header className="flex items-center shrink-0 border-b border-white/[0.06] bg-[#0c0c11]">
        <div className="flex items-center shrink-0 pl-2">
          <button
            onClick={() => setFilesOpen((v) => !v)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            {filesOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 flex-1 min-w-0 overflow-x-auto">
          <AnimatePresence initial={false}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm shrink-0 transition-colors overflow-hidden whitespace-nowrap ${
                  activeTabId === tab.id
                    ? "bg-white/[0.06] text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                <span className="truncate max-w-[140px]">{tab.name}</span>
                <button
                  onClick={(e) => removeTab(e, tab.id)}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/[0.1] transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex items-center shrink-0 pr-2">
          <button
            ref={todoButtonRef}
            onClick={() => {
              if (todoButtonRef.current) {
                const rect = todoButtonRef.current.getBoundingClientRect();
                setTodoMenuPos({
                  top: rect.bottom + 6,
                  right: window.innerWidth - rect.right,
                });
              }
              setTodoOpen((v) => !v);
              setIsAdding(false);
              setTodoInput("");
            }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <ListTodo className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 relative">
        <AnimatePresence initial={false}>
          {filesOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: FILES_WIDTH + 24, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="shrink-0 overflow-hidden"
            >
              <div
                style={{ width: FILES_WIDTH + 24 }}
                className="h-full p-3"
              >
                <div className="flex flex-col h-full rounded-2xl bg-zinc-950 border border-white/[0.06] shadow-2xl shadow-black/30 overflow-hidden">
                  <div className="px-4 pt-3 pb-2 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-200">
                          {sidebarView === "files" ? "Files" : "Playgrounds"}
                        </span>
                        <span className="text-xs text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded-md">
                          {sidebarView === "files" ? mockFileFolders.reduce((acc, f) => acc + f.files.length, 0) : mockPlaygrounds.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex rounded-lg bg-white/[0.03] p-0.5">
                      <button
                        onClick={() => setSidebarView("files")}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          sidebarView === "files"
                            ? "bg-white/[0.08] text-zinc-200"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        Files
                      </button>
                      <button
                        onClick={() => setSidebarView("playgrounds")}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          sidebarView === "playgrounds"
                            ? "bg-white/[0.08] text-zinc-200"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        Playgrounds
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-2 pb-2 relative">
                    <AnimatePresence mode="wait">
                      {sidebarView === "files" ? (
                        <motion.div
                          key="files"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-1"
                        >
                          {mockFileFolders.map((folder, fi) => (
                            <motion.div
                              key={folder.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: fi * 0.05, duration: 0.2 }}
                            >
                              <button
                                onClick={() => toggleFolder(folder.id)}
                                className="flex items-center gap-1.5 w-full px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                              >
                                {expandedFolders.has(folder.id) ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                                <Folder className="w-3 h-3" />
                                {folder.name}
                              </button>
                              <AnimatePresence initial={false}>
                                {expandedFolders.has(folder.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="space-y-0.5 overflow-hidden"
                                  >
                                    {folder.files.map((file, fi_idx) => (
                                      <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: fi_idx * 0.02, duration: 0.1 }}
                                    className="group flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
                                    onClick={() => addFileTab(file.name)}
                                  >
                                    <div
                                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${typeColors[file.type]}`}
                                    >
                                      {(() => {
                                        const Icon = typeIcons[file.type];
                                        return <Icon className="w-3.5 h-3.5" />;
                                      })()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">
                                        {file.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                                        <span>{file.size}</span>
                                        {file.pages && (
                                          <>
                                            <span className="text-zinc-600">·</span>
                                            <span>{file.pages} pages</span>
                                          </>
                                        )}
                                        <span className="text-zinc-600">·</span>
                                        <span>{file.uploadedAt}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                              )}
                            </AnimatePresence>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="playgrounds"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-0.5"
                        >
                          {mockPlaygrounds.map((pg, i) => (
                            <motion.div
                              key={pg.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.2 }}
                              className="group flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
                            >
                              <div className="p-1.5 rounded-lg shrink-0 bg-amber-500/10 text-amber-400 mt-0.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">
                                  {pg.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                                  <span className="truncate">{pg.preview}</span>
                                  <span className="text-zinc-600 shrink-0">·</span>
                                  <span className="shrink-0">{pg.timestamp}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="shrink-0 p-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        if (sidebarView === "playgrounds") addPlaygroundTab();
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-1.5 rounded-xl bg-amber-500 text-sm font-medium text-black hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      {sidebarView === "files" ? "Add files" : "New playground"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className={`flex-1 flex flex-col min-h-0 min-w-0 p-3 ${filesOpen ? "pl-0" : ""}`}>
          <div className="flex-1 flex flex-col min-h-0 rounded-2xl bg-zinc-950 border border-white/[0.06] shadow-2xl shadow-black/30">
            {hasTabs && activeTab ? (
              activeTab.type === "playground" ? (
                <>
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {activeMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-amber-500 text-black"
                              : "bg-white/[0.04] text-zinc-200 border border-white/[0.06]"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="shrink-0 p-3 border-t border-white/[0.06]">
                    <div className="flex items-end gap-2 bg-white/[0.03] rounded-2xl border border-white/[0.06] px-3 py-2 focus-within:border-amber-500/30 transition-colors">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your project..."
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 outline-none resize-none py-0.5 max-h-32"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputValue.trim()}
                        className="p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 transition-all shrink-0 active:scale-[0.98]"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto">
                      <FileText className="w-5 h-5 text-zinc-500" />
                    </div>
                    <p className="text-sm text-zinc-400">{activeTab.name}</p>
                    <p className="text-xs text-zinc-600">File viewer — coming soon</p>
                  </div>
                </div>
              )
            ) : hasTabs && !activeTab ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-zinc-600">Select a tab</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center gap-6 max-w-md w-full">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <FileText className="w-7 h-7 text-zinc-500" />
                  </div>
                  <div className="text-center space-y-1.5">
                    <h2 className="text-lg font-medium text-zinc-300">
                      {projectName}
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                      Upload files to get started, or open a new tab to begin
                      working.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={addPlaygroundTab}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-sm font-medium text-black hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      New playground
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-zinc-300 hover:bg-white/[0.04] active:scale-[0.98] transition-all">
                      <File className="w-4 h-4" />
                      Upload files
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {todoOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="fixed inset-0 z-[9998]"
                  onClick={() => {
                    setTodoOpen(false);
                    setIsAdding(false);
                    setTodoInput("");
                  }}
                />
                <motion.div
                  ref={todoMenuRef}
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "fixed",
                    top: todoMenuPos.top,
                    right: todoMenuPos.right,
                    zIndex: 9999,
                  }}
                  className="w-64 rounded-2xl bg-zinc-900 border border-white/[0.08] shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden"
                >
                  <div className="flex flex-col max-h-80">
                    <div className="flex items-center justify-between px-4 py-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-200">
                          Tasks
                        </span>
                        <span className="text-xs text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded-md">
                          {todos.filter((t) => t.status !== "archived").length}
                        </span>
                      </div>
                    </div>

                    {isAdding && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3 pb-2 shrink-0"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            ref={todoInputRef}
                            value={todoInput}
                            onChange={(e) => setTodoInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addTodo();
                              if (e.key === "Escape") {
                                setIsAdding(false);
                                setTodoInput("");
                              }
                            }}
                            placeholder="Task name..."
                            autoFocus
                            className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-500"
                          />
                          <button
                            onClick={addTodo}
                            disabled={!todoInput.trim()}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 transition-all active:scale-[0.98] shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 min-h-0">
                      <AnimatePresence initial={false}>
                        {todos
                          .filter((t) => t.status !== "archived")
                          .map((todo) => (
                            <motion.div
                              key={todo.id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-colors group overflow-hidden"
                            >
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateTodoStatus(
                                    todo.id,
                                    todo.status === "completed" ? "pending" : "completed"
                                  )
                                }
                                className="shrink-0"
                              >
                                {todo.status === "completed" ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                                  </motion.div>
                                ) : (
                                  <Circle className="w-4 h-4 text-zinc-600" />
                                )}
                              </motion.button>
                              <span
                                className={`flex-1 text-sm truncate ${
                                  todo.status === "completed"
                                    ? "text-zinc-500 line-through"
                                    : "text-zinc-200"
                                }`}
                              >
                                {todo.text}
                              </span>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                {todo.status !== "in_progress" && (
                                  <button
                                    onClick={() =>
                                      updateTodoStatus(todo.id, "in_progress")
                                    }
                                    className="p-1 rounded text-zinc-600 hover:text-sky-400 hover:bg-white/[0.06] transition-colors"
                                  >
                                    <Circle className="w-3 h-3 fill-current opacity-30" />
                                  </button>
                                )}
                                {todo.status === "in_progress" && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-sky-400 bg-sky-500/10">
                                    In progress
                                  </span>
                                )}
                                <button
                                  onClick={() =>
                                    updateTodoStatus(todo.id, "archived")
                                  }
                                  className="p-1 rounded text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.06] transition-colors"
                                >
                                  <Archive className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteTodo(todo.id)}
                                  className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-white/[0.06] transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.div>
                          ))}

                        {todos.filter((t) => t.status !== "archived")
                          .length === 0 && !isAdding && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-6"
                          >
                            <p className="text-xs text-zinc-600">No tasks</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="shrink-0 flex items-center justify-between px-3 py-2 border-t border-white/[0.06]">
                      <button
                        onClick={() => {
                          setIsAdding(true);
                          setTimeout(() => todoInputRef.current?.focus(), 50);
                        }}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.95] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {todos.some((t) => t.status === "archived") && (
                        <button
                          onClick={() => {
                            todos
                              .filter((t) => t.status === "archived")
                              .forEach((t) => updateTodoStatus(t.id, "pending"));
                          }}
                          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          Restore archived
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
