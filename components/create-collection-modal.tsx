"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const colors = [
  { id: "amber", preview: "bg-amber-500" },
  { id: "sky", preview: "bg-sky-500" },
  { id: "emerald", preview: "bg-emerald-500" },
  { id: "violet", preview: "bg-violet-500" },
  { id: "rose", preview: "bg-rose-500" },
  { id: "cyan", preview: "bg-cyan-500" },
  { id: "orange", preview: "bg-orange-500" },
  { id: "zinc", preview: "bg-zinc-500" },
];

interface CreateCollectionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCollectionModal({
  open,
  onClose,
}: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onClose();
    setName("");
    setSelectedColor(colors[0]);
  };

  const handleClose = () => {
    onClose();
    setName("");
    setSelectedColor(colors[0]);
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
              className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-base font-semibold text-zinc-100">
                  New Collection
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
                    placeholder="Collection name"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-white/[0.06]"
                  />
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
                    Create
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
