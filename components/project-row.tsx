"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Copy,
  Trash2,
  RotateCcw,
  FolderPlus,
  ArrowLeft,
  Check,
} from "lucide-react";
import type { Project } from "./project-card";
import { collections } from "@/lib/mock-data";

const colorBarMap: Record<string, string> = {
  "from-violet-600": "bg-violet-500",
  "from-emerald-500": "bg-emerald-500",
  "from-orange-500": "bg-orange-500",
  "from-sky-500": "bg-sky-500",
  "from-fuchsia-500": "bg-fuchsia-500",
  "from-amber-500": "bg-amber-500",
  "from-red-500": "bg-red-500",
  "from-lime-500": "bg-lime-500",
  "from-cyan-500": "bg-cyan-500",
  "from-zinc-600": "bg-zinc-500",
  "from-zinc-500": "bg-zinc-500",
};

const collectionAccentMap: Record<string, { text: string; bg: string; border: string }> = {
  personal: { text: "hover:text-amber-400", bg: "hover:bg-amber-500/10", border: "hover:border-amber-500/20" },
  team: { text: "hover:text-sky-400", bg: "hover:bg-sky-500/10", border: "hover:border-sky-500/20" },
  clients: { text: "hover:text-emerald-400", bg: "hover:bg-emerald-500/10", border: "hover:border-emerald-500/20" },
  archive: { text: "hover:text-zinc-400", bg: "hover:bg-zinc-500/10", border: "hover:border-zinc-500/20" },
};

const mainMenuItems = [
  { icon: ExternalLink, label: "Open", action: "open" },
  { icon: Pencil, label: "Rename", action: "rename" },
  { icon: Copy, label: "Duplicate", action: "duplicate" },
  { icon: FolderPlus, label: "Add to Collection", action: "addToCollection" },
  { icon: Trash2, label: "Delete", action: "delete", danger: true },
];

const trashMenuItems = [
  { icon: RotateCcw, label: "Recover", action: "recover" },
  { icon: Trash2, label: "Remove", action: "deleteForever", danger: true },
];

export function ProjectRow({
  project,
  index,
  isTrash = false,
}: {
  project: Project;
  index: number;
  isTrash?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenu, setSubmenu] = useState<"main" | "collections">("main");
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setSubmenu("main");
    setMenuOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleMenuAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (action === "addToCollection") {
      setSubmenu("collections");
      return;
    }
    closeMenu();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const colorStart = project.gradient.split(" ")[0];
  const barColor = colorBarMap[colorStart] || "bg-zinc-500";
  const MENU_WIDTH = 176;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.2,
          delay: index * 0.03,
          ease: "easeOut",
        }}
        whileHover={{ x: 4, transition: { duration: 0.15 } }}
        onClick={() => router.push(`/projects/${project.id}`)}
        className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
      >
        <div className={`w-1.5 h-10 rounded-full ${barColor} shrink-0`} />

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-xs text-zinc-500 truncate mt-0.5">
            {project.description}
          </p>
        </div>

        {project.collectionId && (() => {
          const accent = collectionAccentMap[project.collectionId] ?? collectionAccentMap.personal;
          return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/collections/${project.collectionId}`);
            }}
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs text-zinc-400 bg-white/[0.03] border border-white/[0.06] ${accent.text} ${accent.bg} ${accent.border} transition-colors duration-150`}
          >
            #{collections.find(c => c.id === project.collectionId)?.name ?? project.collectionId}
          </button>
          );
        })()}

        <div className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
          <Clock className="w-3 h-3" />
          {project.updatedAt}
        </div>

        <div className="flex -space-x-1.5 shrink-0">
          <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-zinc-900 flex items-center justify-center text-[8px] font-medium text-white">
            A
          </div>
          <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-zinc-900 flex items-center justify-center text-[8px] font-medium text-white">
            B
          </div>
        </div>

        <button
          ref={buttonRef}
          onClick={openMenu}
          className="p-1 rounded-md text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-zinc-300 hover:bg-white/[0.06] transition-all shrink-0"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </motion.div>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="fixed inset-0 z-[9998]"
                  onClick={closeMenu}
                />
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "fixed",
                    top: menuPosition.top,
                    right: menuPosition.right,
                    zIndex: 9999,
                  }}
                  className="rounded-xl bg-zinc-900 border border-white/[0.08] shadow-xl shadow-black/30 backdrop-blur-xl"
                >
                  <div style={{ overflow: "hidden", width: MENU_WIDTH }}>
                    <motion.div
                      animate={{ x: submenu === "collections" ? -MENU_WIDTH : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex"
                    >
                      <div style={{ width: MENU_WIDTH }} className="shrink-0 py-1.5">
                      {(isTrash ? trashMenuItems : mainMenuItems).map(
                        (item) => (
                          <button
                            key={item.action}
                            onClick={(e) =>
                              handleMenuAction(e, item.action)
                            }
                            className={`flex items-center gap-3 w-full px-3.5 py-2 text-sm transition-colors ${
                              item.danger
                                ? "text-red-400 hover:bg-red-500/10"
                                : "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100"
                            }`}
                          >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                          </button>
                        )
                      )}
                    </div>

                    <div style={{ width: MENU_WIDTH }} className="shrink-0 py-1.5">
                      <button
                        onClick={() => setSubmenu("main")}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Collections
                      </button>
                      <div className="h-px bg-white/[0.06] my-1" />
                      {collections.map((c) => {
                        const isActive = project.collectionId === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeMenu();
                            }}
                            className={`flex items-center gap-3 w-full px-3.5 py-2 text-sm transition-colors ${
                              isActive
                                ? "text-amber-400 bg-white/[0.04]"
                                : "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100"
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border transition-colors shrink-0 ${
                                isActive
                                  ? "bg-amber-500 border-amber-500"
                                  : "border-zinc-600"
                              }`}
                            />
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
