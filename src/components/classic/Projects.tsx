"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLocationBySlug } from "@/data/locations";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";

export function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="relative py-20">
      <div className="pointer-events-none absolute inset-x-0 top-6 bottom-6 bg-[radial-gradient(circle_at_80%_0%,rgba(167,139,250,0.2),transparent_40%),radial-gradient(circle_at_10%_30%,rgba(34,211,238,0.14),transparent_36%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Innovation Park" title="Featured projects">
          Six case studies from construction, food, healthcare, fitness, wellness, and automotive work.
        </SectionHeading>
        {featured ? (
          <Reveal>
            <div className="mt-10">
              <ProjectCard project={featured} featured />
            </div>
          </Reveal>
        ) : null}
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.04}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const accent = getLocationBySlug(project.slug)?.accent ?? "#67e8f9";
  const technologies = project.technologies?.slice(0, featured ? 8 : 4) ?? [];

  return (
    <article
      className={
        featured
          ? "flex h-full flex-col rounded-3xl border-2 bg-slate-950/70 p-6 shadow-[0_0_56px_rgba(34,211,238,0.14)] sm:p-8 lg:flex-row lg:gap-10"
          : "glass flex h-full flex-col rounded-3xl border-t-2 p-6"
      }
      style={{ borderColor: accent }}
    >
      <div className={featured ? "lg:flex-1" : undefined}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          {featured ? "Featured" : project.category}
        </p>
        <h3 className={featured ? "mt-3 font-display text-4xl text-white" : "mt-3 font-display text-2xl text-white"}>
          {project.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-violet-100">{project.role}</p>
        {featured ? <p className="mt-2 text-sm text-slate-400">{project.category}</p> : null}
        <p className="mt-4 text-sm leading-6 text-slate-200">{project.description}</p>
      </div>
      <div className={featured ? "mt-6 lg:mt-0 lg:w-[320px]" : "mt-auto"}>
        {technologies.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <li key={technology}>
                <TechBadge name={technology} prominent={featured} />
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Open case study
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
