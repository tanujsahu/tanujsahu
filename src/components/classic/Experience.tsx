"use client";

import { experience } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Experience Tower" title="Professional journey">
        Three roles across full-stack delivery, from MEAN product work to leading enterprise engineering.
      </SectionHeading>
      <ol className="mt-12 space-y-6">
        {experience.map((role, index) => (
          <Reveal key={role.id} delay={index * 0.05}>
            <li className="glass grid gap-6 rounded-3xl p-6 sm:grid-cols-[220px_1fr] sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-200">
                  Floor {experience.length - index}
                </p>
                <h3 className="mt-2 font-display text-2xl text-white">{role.company}</h3>
                <p className="mt-2 text-sm text-cyan-100">{role.role}</p>
                <p className="mt-2 text-sm text-slate-400">{role.period}</p>
              </div>
              <ul className="space-y-2">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
