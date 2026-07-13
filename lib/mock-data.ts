import type { Project } from "@/components/project-card";

export interface Collection {
  id: string;
  name: string;
  color: string;
  updatedAt: string;
}

export const collections: Collection[] = [
  { id: "personal", name: "Personal", color: "from-amber-500", updatedAt: "2 days ago" },
  { id: "team", name: "Team", color: "from-sky-500", updatedAt: "5 hours ago" },
  { id: "clients", name: "Client Work", color: "from-emerald-500", updatedAt: "1 week ago" },
  { id: "archive", name: "Archive", color: "from-zinc-500", updatedAt: "1 month ago" },
];

export const projects: Project[] = [
  {
    id: "1",
    name: "Mobile App Redesign",
    description: "Complete redesign of the iOS and Android mobile experience",
    updatedAt: "2 hours ago",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    collectionId: "team",
  },
  {
    id: "2",
    name: "Marketing Landing Page",
    description: "New landing page for Q4 product launch campaign",
    updatedAt: "5 hours ago",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    collectionId: "clients",
  },
  {
    id: "3",
    name: "Design System v2",
    description: "Component library, tokens, and documentation",
    updatedAt: "1 day ago",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    collectionId: "team",
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    description: "Real-time analytics and reporting dashboard UI",
    updatedAt: "2 days ago",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    collectionId: "personal",
  },
  {
    id: "5",
    name: "User Onboarding Flow",
    description: "Step-by-step onboarding experience for new users",
    updatedAt: "3 days ago",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
    collectionId: "team",
  },
  {
    id: "6",
    name: "Icon Library",
    description: "Custom icon set with 200+ scalable vector icons",
    updatedAt: "1 week ago",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    collectionId: "personal",
  },
  {
    id: "7",
    name: "Brand Guidelines",
    description: "Visual identity, typography, and color system",
    updatedAt: "1 week ago",
    gradient: "from-red-500 via-rose-500 to-pink-600",
    collectionId: "clients",
  },
  {
    id: "8",
    name: "Email Templates",
    description: "Responsive transactional and marketing email designs",
    updatedAt: "2 weeks ago",
    gradient: "from-lime-500 via-green-500 to-emerald-600",
    collectionId: "team",
  },
  {
    id: "9",
    name: "Portfolio Website",
    description: "Personal portfolio with case studies",
    updatedAt: "3 weeks ago",
    gradient: "from-cyan-500 via-blue-500 to-violet-600",
    collectionId: "personal",
  },
];

export const recentProjects: Project[] = [
  {
    id: "3",
    name: "Design System v2",
    description: "Component library, tokens, and documentation",
    updatedAt: "20 minutes ago",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    collectionId: "team",
  },
  {
    id: "1",
    name: "Mobile App Redesign",
    description: "Complete redesign of the iOS and Android mobile experience",
    updatedAt: "2 hours ago",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    collectionId: "team",
  },
  {
    id: "5",
    name: "User Onboarding Flow",
    description: "Step-by-step onboarding experience for new users",
    updatedAt: "Yesterday",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
    collectionId: "team",
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    description: "Real-time analytics and reporting dashboard UI",
    updatedAt: "2 days ago",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    collectionId: "personal",
  },
  {
    id: "7",
    name: "Brand Guidelines",
    description: "Visual identity, typography, and color system",
    updatedAt: "3 days ago",
    gradient: "from-red-500 via-rose-500 to-pink-600",
    collectionId: "clients",
  },
];

export const trashProjects: Project[] = [
  {
    id: "t1",
    name: "Old Homepage Concept",
    description: "Initial homepage design that was replaced",
    updatedAt: "Trashed 3 days ago",
    gradient: "from-zinc-600 via-zinc-500 to-zinc-700",
    collectionId: "archive",
  },
  {
    id: "t2",
    name: "Summer Campaign",
    description: "Seasonal marketing campaign assets",
    updatedAt: "Trashed 1 week ago",
    gradient: "from-zinc-600 via-zinc-500 to-zinc-700",
    collectionId: "clients",
  },
  {
    id: "t3",
    name: "Wireframe Drafts",
    description: "Early wireframe explorations for the app",
    updatedAt: "Trashed 2 weeks ago",
    gradient: "from-zinc-600 via-zinc-500 to-zinc-700",
    collectionId: "personal",
  },
];
