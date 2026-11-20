"use client";

import { philosophy } from "@/data/philosophy";
import { PhilosophyDiagram } from "@/components/portfolio/PhilosophyDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Philosophy() {
  return (
    <section id="philosophy" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Architecture & Engineering" title="How the work is shaped">
        Four zones inside the engineering center. Each one is a working principle, not a slogan on a slide.
      </SectionHeading>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {philosophy.map((zone, index) => (
          <Reveal key={zone.id} delay={index * 0.04}>
            <article className="glass rounded-3xl p-6">
              <PhilosophyDiagram id={zone.id} />
              <h3 className="mt-4 font-display text-2xl text-white">{zone.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{zone.statement}</p>
              <ul className="mt-4 space-y-2">
                {zone.points.map((point) => (
                  <li key={point} className="text-sm leading-6 text-slate-400">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
