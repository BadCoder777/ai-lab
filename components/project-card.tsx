"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Clock,
  ExternalLink,
  Pencil,
  Copy,
  Trash2,
  RotateCcw,
  FolderPlus,
  ArrowLeft,
  Check,
} from "lucide-react";
import { collections } from "@/lib/mock-data";

export interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  gradient: string;
  collectionId?: string;
}

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

export function ProjectCard({
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

  const MENU_WIDTH = 176;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.25,
          delay: index * 0.03,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => router.push(`/projects/${project.id}`)}
        className="group cursor-pointer"
      >
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 group-hover:border-white/[0.12] group-hover:bg-white/[0.04] group-hover:shadow-2xl group-hover:shadow-amber-500/[0.04]">
          <div
            className={`relative h-40 bg-gradient-to-br ${project.gradient} overflow-hidden`}
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/[0.07] blur-sm" />
            <div className="absolute bottom-4 left-4 w-24 h-8 rounded-full bg-white/[0.05] blur-sm" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-2xl border border-white/[0.1] rotate-12" />

            <button
              ref={buttonRef}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/30 backdrop-blur-sm"
              onClick={openMenu}
            >
              <MoreHorizontal className="w-4 h-4 text-white/80" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-sm text-zinc-200 mb-1 group-hover:text-zinc-100 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-1 mb-3">
              {project.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock className="w-3 h-3" />
                {project.updatedAt}
              </div>
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-zinc-900 flex items-center justify-center text-[8px] font-medium text-white">
                  A
                </div>
                <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-zinc-900 flex items-center justify-center text-[8px] font-medium text-white">
                  B
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  className="w-44 rounded-xl bg-zinc-900 border border-white/[0.08] shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden"
                >
                  <motion.div
                    animate={{ x: submenu === "collections" ? -MENU_WIDTH : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 32,
                    }}
                    className="flex"
                  >
                    <div className="w-44 shrink-0 py-1.5">
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

                    <div className="w-44 shrink-0 py-1.5">
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
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
