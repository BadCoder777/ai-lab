"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectRow } from "@/components/project-row";
import { LayoutToggle, type LayoutMode } from "@/components/layout-toggle";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { trashProjects } from "@/lib/mock-data";

export default function TrashPage() {
  const [layout, setLayout] = useState<LayoutMode>("list");
  const [cleanDialogOpen, setCleanDialogOpen] = useState(false);

  const handleCleanTrash = () => {
    setCleanDialogOpen(false);
  };

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
              <Trash2 className="w-4 h-4 text-zinc-500" />
              Trash
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-zinc-500 mt-0.5"
            >
              {trashProjects.length} {trashProjects.length === 1 ? "item" : "items"}
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <LayoutToggle layout={layout} onChange={setLayout} />
            {trashProjects.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => setCleanDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all duration-200"
              >
                <AlertTriangle className="w-4 h-4" />
                Clean Trash
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {trashProjects.length > 0 ? (
          layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trashProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isTrash
                />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              {trashProjects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  isTrash
                />
              ))}
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-400 mb-2">
              Trash is empty
            </h2>
            <p className="text-sm text-zinc-600 max-w-sm">
              Deleted projects will appear here.
            </p>
          </motion.div>
        )}
      </div>

      <ConfirmDialog
        open={cleanDialogOpen}
        title="Clean Trash"
        message="This action is unrecoverable. All items in the trash will be permanently deleted and cannot be restored."
        confirmLabel="Delete All"
        variant="danger"
        onConfirm={handleCleanTrash}
        onCancel={() => setCleanDialogOpen(false)}
      />
    </div>
  );
}
