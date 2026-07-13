"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FolderOpen, ChevronRight, Plus } from "lucide-react";
import { collections, projects } from "@/lib/mock-data";
import { CreateCollectionModal } from "@/components/create-collection-modal";

const colorMap: Record<string, string> = {
  "from-amber-500": "bg-amber-500",
  "from-sky-500": "bg-sky-500",
  "from-emerald-500": "bg-emerald-500",
  "from-zinc-500": "bg-zinc-500",
};

export default function CollectionsPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const getProjectCount = (collectionId: string) =>
    projects.filter((p) => p.collectionId === collectionId).length;

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
              <FolderOpen className="w-4 h-4 text-amber-400" />
              Collections
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-zinc-500 mt-0.5"
            >
              {collections.length} collections
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-0.5">
          {collections.map((collection, index) => {
            const count = getProjectCount(collection.id);
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.04,
                  ease: "easeOut",
                }}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                onClick={() => router.push(`/collections/${collection.id}`)}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${
                    colorMap[collection.color] || "bg-zinc-500"
                  } flex items-center justify-center shrink-0`}
                >
                  <FolderOpen className="w-5 h-5 text-white/80" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {count} {count === 1 ? "project" : "projects"} &middot;{" "}
                    {collection.updatedAt}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
              </motion.div>
            );
          })}
        </div>

        {collections.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
              <FolderOpen className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-400 mb-2">
              No collections yet
            </h2>
            <p className="text-sm text-zinc-600 max-w-sm mb-6">
              Create collections to organize your projects.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Collection
            </button>
          </motion.div>
        )}
      </div>

      <CreateCollectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
