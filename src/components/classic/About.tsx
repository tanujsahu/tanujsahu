"use client";

import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading eyebrow="Developer Headquarters" title="About">
          A senior engineer who builds the system, then helps the team carry it.
        </SectionHeading>
        <Reveal>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <p className="text-base leading-7 text-slate-200">{profile.introduction}</p>
            <p className="mt-4 text-base leading-7 text-slate-300">{profile.approach}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {profile.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-sm text-cyan-50"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-400">{profile.locationLabel}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
