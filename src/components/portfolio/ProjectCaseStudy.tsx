import type { Project } from "@/data/projects";
import { TechBadge } from "@/components/ui/TechBadge";

export function ProjectCaseStudy({
  project,
  variant = "page",
}: {
  project: Project;
  variant?: "page" | "panel";
}) {
  return (
    <article className={variant === "page" ? "space-y-10" : "space-y-6"}>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
          {project.category}
        </p>
        <h1
          className={
            variant === "page"
              ? "mt-3 font-display text-4xl text-white sm:text-5xl"
              : "mt-2 font-display text-3xl text-white"
          }
        >
          {project.name}
        </h1>
        <p className="mt-3 text-sm text-violet-200">{project.role}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          {project.description}
        </p>
      </header>

      <section>
        <h2 className="font-display text-xl text-white">Responsibilities</h2>
        <ul className="mt-3 space-y-2">
          {project.responsibilities.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {project.technologies && project.technologies.length > 0 ? (
        <section className="rounded-3xl border border-cyan-200/30 bg-cyan-200/8 p-4 sm:p-5">
          <h2 className="font-display text-xl text-white">Technologies</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <TechBadge name={technology} prominent />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.demoUrl || project.repositoryUrl ? (
        <div className="flex flex-wrap gap-3">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              className="rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Live demo
            </a>
          ) : null}
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white"
            >
              GitHub
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
