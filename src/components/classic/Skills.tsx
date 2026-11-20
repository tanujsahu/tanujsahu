"use client";

import { signatureSkills, skillGroups } from "@/data/skills";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";

export function Skills() {
  return (
    <section id="skills" className="relative py-20">
      <div className="pointer-events-none absolute inset-x-0 top-6 bottom-6 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.2),transparent_42%),radial-gradient(circle_at_85%_20%,rgba(167,139,250,0.14),transparent_36%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Technology District" title="Technical expertise">
          The stack behind the enterprise work: interfaces, services, data, and delivery.
        </SectionHeading>
        <Reveal>
          <div className="mt-10 rounded-3xl border border-cyan-200/35 bg-cyan-200/8 p-5 shadow-[0_0_48px_rgba(34,211,238,0.12)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Core expertise
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {signatureSkills.map((skill) => (
                <li key={skill.name}>
                  <TechBadge name={skill.name} icon={skill.icon} prominent />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.04}>
              <article className="glass h-full rounded-3xl border-cyan-200/20 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl text-white">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{group.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill.name}>
                      <TechBadge name={skill.name} icon={skill.icon} />
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
