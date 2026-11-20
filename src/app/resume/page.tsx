import type { Metadata } from "next";
import Link from "next/link";
import { experience } from "@/data/experience";
import { education, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume summary for ${profile.name}, ${profile.title}.`,
};

export default function ResumePage() {
  return (
    <main id="content" className="mx-auto min-h-screen max-w-3xl bg-[#f6f3ec] px-6 py-12 text-slate-900 print:py-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Text summary generated from the portfolio profile. Replace public/resume.pdf with an official resume when you have one.
      </p>
      <header className="mt-4 border-b border-slate-300 pb-4">
        <h1 className="font-display text-4xl">{profile.name}</h1>
        <p className="mt-1 text-lg">{profile.title}</p>
        <p className="mt-2 text-sm">
          {profile.locationLabel} · {profile.email} · {profile.phone}
        </p>
        <p className="text-sm">{profile.github}</p>
      </header>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Summary</h2>
        <p className="mt-2 text-sm leading-6">{profile.introduction}</p>
        <p className="mt-2 text-sm leading-6">{profile.approach}</p>
      </section>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Experience</h2>
        {experience.map((role) => (
          <article key={role.id} className="mt-4">
            <h3 className="text-base font-semibold">
              {role.company} — {role.role}
            </h3>
            <p className="text-sm text-slate-600">{role.period}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {role.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Selected skills</h2>
        {skillGroups.map((group) => (
          <p key={group.id} className="mt-2 text-sm">
            <span className="font-semibold">{group.title}: </span>
            {group.skills.map((skill) => skill.name).join(", ")}
          </p>
        ))}
      </section>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Featured projects</h2>
        {projects.map((project) => (
          <article key={project.slug} className="mt-3">
            <h3 className="text-base font-semibold">
              {project.name} — {project.role}
            </h3>
            <p className="text-sm text-slate-600">{project.category}</p>
            <p className="mt-1 text-sm leading-6">{project.description}</p>
          </article>
        ))}
      </section>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Education</h2>
        <p className="mt-2 text-sm font-semibold">{education.degree}</p>
        <p className="text-sm">
          {education.institution} · {education.yearLabel} {education.year}
        </p>
      </section>
      <p className="mt-8 text-sm">
        <Link href="/resume.pdf" className="underline">
          Download PDF
        </Link>
        {" · "}
        <Link href="/?view=classic" className="underline">
          Back to portfolio
        </Link>
      </p>
    </main>
  );
}
