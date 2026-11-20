"use client";

import { education } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Education Campus" title="Education" />
      <Reveal>
        <article className="glass mt-10 max-w-3xl rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Degree</p>
          <h3 className="mt-3 font-display text-3xl text-white">{education.degree}</h3>
          <p className="mt-3 text-lg text-slate-200">{education.institution}</p>
          <p className="mt-2 text-sm text-slate-400">
            {education.yearLabel}: {education.year}
          </p>
        </article>
      </Reveal>
    </section>
  );
}
