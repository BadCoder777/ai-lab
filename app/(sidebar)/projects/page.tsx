"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectRow } from "@/components/project-row";
import { CreateProjectModal } from "@/components/create-project-modal";
import { LayoutToggle, type LayoutMode } from "@/components/layout-toggle";
import { projects } from "@/lib/mock-data";

export default function ProjectsPage() {
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 bg-[#0c0c11]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold text-zinc-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              All Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-zinc-500 mt-0.5"
            >
              {projects.length} projects
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <LayoutToggle layout={layout} onChange={setLayout} />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
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
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
              <Plus className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-400 mb-2">
              No projects yet
            </h2>
            <p className="text-sm text-zinc-600 max-w-sm mb-6">
              Create your first project to get started. Design, collaborate, and
              bring your ideas to life.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
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
