import { projects } from "@/lib/mock-data";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  return (
    <h1 className="m-auto text-xl font-semibold text-zinc-100">
      {project?.name ?? "Project not found"}
    </h1>
  );
}
