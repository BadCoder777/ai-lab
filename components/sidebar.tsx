"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  FolderOpen,
  Clock,
  Layers,
  Trash2,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { icon: Clock, label: "Recent", href: "/recent" },
  { icon: FolderOpen, label: "All Projects", href: "/projects" },
  { icon: Layers, label: "Collections", href: "/collections" },
  { icon: Trash2, label: "Trash", href: "/trash" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-zinc-950 border-r border-white/[0.06] shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? "w-10" : "w-60"
      }`}
    >
      <div
        className={`flex pt-3 pb-2 ${
          collapsed ? "justify-center px-0" : "justify-end px-3"
        }`}
      >
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-200 ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 text-sm transition-all duration-200 focus-within:border-amber-500/50 focus-within:bg-white/[0.06]">
            <Search className="w-4 h-4 shrink-0" />
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-transparent outline-none placeholder:text-zinc-500 w-full text-sm"
            />
          </div>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/recent"
                  ? pathname === "/" || pathname === "/recent"
                  : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-zinc-100 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-xs font-medium text-white shrink-0">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">
                User Name
              </p>
              <p className="text-xs text-zinc-500 truncate">user@email.com</p>
            </div>
            <Settings className="w-4 h-4 text-zinc-500 shrink-0" />
          </div>
        </div>
      </div>
    </aside>
  );
}
