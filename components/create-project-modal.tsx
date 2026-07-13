"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check } from "lucide-react";

const collections = [
  { id: "personal", label: "Personal" },
  { id: "team", label: "Team" },
  { id: "clients", label: "Client Work" },
  { id: "archive", label: "Archive" },
];

const colors = [
  {
    id: "violet",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    preview: "bg-gradient-to-br from-violet-500 to-indigo-500",
  },
  {
    id: "emerald",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    preview: "bg-gradient-to-br from-emerald-400 to-cyan-500",
  },
  {
    id: "orange",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    preview: "bg-gradient-to-br from-orange-400 to-pink-500",
  },
  {
    id: "sky",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    preview: "bg-gradient-to-br from-sky-400 to-indigo-500",
  },
  {
    id: "fuchsia",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
    preview: "bg-gradient-to-br from-fuchsia-400 to-rose-500",
  },
  {
    id: "amber",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    preview: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  {
    id: "red",
    gradient: "from-red-500 via-rose-500 to-pink-600",
    preview: "bg-gradient-to-br from-red-400 to-pink-500",
  },
  {
    id: "lime",
    gradient: "from-lime-500 via-green-500 to-emerald-600",
    preview: "bg-gradient-to-br from-lime-400 to-emerald-500",
  },
];

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState(collections[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collectionOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCollectionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [collectionOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onClose();
    setName("");
    setDescription("");
    setCollection(collections[0]);
    setSelectedColor(colors[0]);
    setCollectionOpen(false);
  };

  const handleClose = () => {
    onClose();
    setName("");
    setDescription("");
    setCollection(collections[0]);
    setSelectedColor(colors[0]);
    setCollectionOpen(false);
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-zinc-900 border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-base font-semibold text-zinc-100">
                  New Project
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Description{" "}
                    <span className="text-zinc-600 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the project"
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-white/[0.06] resize-none"
                  />
                </div>

                <div ref={dropdownRef}>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Collection
                  </label>
                  <button
                    type="button"
                    onClick={() => setCollectionOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-200 transition-all duration-200 hover:bg-white/[0.06]"
                  >
                    <span>{collection.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                        collectionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {collectionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute mt-1 w-[calc(100%-2.5rem)] max-w-[calc(28rem-2.5rem)] py-1.5 rounded-xl bg-zinc-800 border border-white/[0.08] shadow-xl shadow-black/30 z-50"
                      >
                        {collections.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCollection(c);
                              setCollectionOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3.5 py-2 text-sm transition-colors ${
                              collection.id === c.id
                                ? "text-amber-400 bg-white/[0.06]"
                                : "text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-100"
                            }`}
                          >
                            {c.label}
                            {collection.id === c.id && (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-lg ${c.preview} transition-all duration-200 ${
                          selectedColor.id === c.id
                            ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                            : "hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.08] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/30 disabled:text-zinc-500 text-zinc-900 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
