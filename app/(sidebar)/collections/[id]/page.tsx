"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FolderOpen,
  Plus,
  Sparkles,
  Package,
} from "lucide-react";
import { ProjectCard, type Project } from "@/components/project-card";
import { ProjectRow } from "@/components/project-row";
import { CreateProjectModal } from "@/components/create-project-modal";
import { LayoutToggle, type LayoutMode } from "@/components/layout-toggle";
import { collections, projects } from "@/lib/mock-data";

const colorMap: Record<string, string> = {
  "from-amber-500": "bg-amber-500",
  "from-sky-500": "bg-sky-500",
  "from-emerald-500": "bg-emerald-500",
  "from-zinc-500": "bg-zinc-500",
};

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const collection = collections.find((c) => c.id === id);
  const collectionProjects = projects.filter(
    (p) => p.collectionId === id
  );

  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [modalOpen, setModalOpen] = useState(false);

  if (!collection) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-zinc-500">Collection not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 bg-[#0c0c11]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div
              className={`w-8 h-8 rounded-lg ${
                colorMap[collection.color] || "bg-zinc-500"
              } flex items-center justify-center`}
            >
              <FolderOpen className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-zinc-100"
              >
                {collection.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-zinc-500"
              >
                {collectionProjects.length}{" "}
                {collectionProjects.length === 1 ? "project" : "projects"}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LayoutToggle layout={layout} onChange={setLayout} />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              New Project
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {collectionProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {collectionProjects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {collectionProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Package className="w-10 h-10 text-zinc-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Plus className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-zinc-400 mb-2">
              No projects yet
            </h2>
            <p className="text-sm text-zinc-600 max-w-sm mb-6">
              Add your first project to this collection and start organizing your
              work.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </motion.div>
        )}
      </div>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
