import { projects } from "@/lib/mock-data";
import { ProjectWorkspace } from "@/components/project-workspace";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Project not found</p>
      </div>
    );
  }

  return <ProjectWorkspace projectName={project.name} />;
}
