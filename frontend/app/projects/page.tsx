"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore, Project } from "../../store/useProjectStore";
import { PrioritySignalIcon } from "../../components/tasks/PrioritySignalIcon";
import { FieldsPopover, FieldsState } from "../../components/tasks/FieldsPopover";
import { CreateProjectModal } from "../../components/projects/CreateProjectModal";
import { Search, Filter, Plus, MoreHorizontal, Trash2 } from "lucide-react";

export default function ProjectsPage() {
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const projects = useProjectStore((state) => state.projects);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const userId = useAuthStore((state) => state.userId);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [dummyViewMode, setDummyViewMode] = useState<"board" | "list">("list");

  // Dynamic Fields visibility state for Projects table matching SS9/SS11
  const [visibleFields, setVisibleFields] = useState<FieldsState>({
    priority: true,
    members: true, // Lead column
    dueDate: true,
    labels: false,
    status: false,
    reporter: false,
  });

  useEffect(() => {
    if (isHydrated && !userId) {
      router.push("/login");
    }
  }, [isHydrated, userId, router]);

  useEffect(() => {
    if (userId) fetchProjects();
  }, [userId, fetchProjects]);

  // ⌘F / Ctrl+F search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleField = (fieldKey: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  // Filter projects by title
  const filteredProjects = projects.filter((p) =>
    searchQuery.trim() === ""
      ? true
      : p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (!isHydrated) return null;

  return (
    <AppLayout>
      {/* Header Toolbar matching Figma SS9 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-12 py-1.5 border border-border rounded-lg bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[10px] text-muted-foreground/60 border border-border bg-muted px-1 rounded-sm font-mono select-none">
              ⌘F
            </span>
          </div>

          {/* Reusable Fields Popover matching SS9/SS11 */}
          <FieldsPopover
            viewMode={dummyViewMode}
            onViewModeChange={setDummyViewMode}
            visibleFields={visibleFields}
            onToggleField={handleToggleField}
          />

          {/* Filter Button */}
          <button
            type="button"
            className="p-1.5 border border-border rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
            title="Filter projects"
          >
            <Filter className="h-4 w-4" />
          </button>

          {/* Add Project Action Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-foreground text-background px-3.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 flex items-center shadow-2xs transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects Overview Table matching Figma SS9 & SS11 */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-2xs">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
          <div className="flex-1 min-w-[200px]">Projects</div>
          {visibleFields.priority && <div className="w-28 shrink-0">Priority</div>}
          {visibleFields.members && <div className="w-24 shrink-0">Lead</div>}
          {visibleFields.dueDate && <div className="w-28 shrink-0">Due Date</div>}
          <div className="w-12 text-right shrink-0">Actions</div>
        </div>

        <div className="divide-y divide-border">
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No projects found. Click "+ Add Project" to create one.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 px-4 py-3 text-xs hover:bg-muted/30 transition-colors"
              >
                {/* Project Title / Link to Project Tasks View (SS12) */}
                <div className="flex-1 min-w-[200px] font-medium text-foreground truncate">
                  <Link
                    href={`/projects/${project.id}`}
                    className="hover:underline text-primary cursor-pointer"
                  >
                    {project.name}
                  </Link>
                </div>

                {/* Priority */}
                {visibleFields.priority && (
                  <div className="w-28 shrink-0">
                    <PrioritySignalIcon priority={project.priority} />
                  </div>
                )}

                {/* Lead */}
                {visibleFields.members && (
                  <div className="w-24 shrink-0 flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-[10px] font-bold">
                      {project.lead ? project.lead.charAt(0).toUpperCase() : "A"}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                {visibleFields.dueDate && (
                  <div className="w-28 shrink-0 text-muted-foreground">
                    {formatDate(project.dueDate)}
                  </div>
                )}

                {/* Actions */}
                <div className="w-12 flex justify-end shrink-0 space-x-1">
                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(project)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Edit project details"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Inline Add Project Action matching Figma SS9 */}
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              <span>Add Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
      />
    </AppLayout>
  );
}
