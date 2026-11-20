"use client";

import Link from "next/link";
import { profile, stats } from "@/data/profile";
import { projects } from "@/data/projects";
import { signatureSkills } from "@/data/skills";
import { Button } from "@/components/ui/Button";
import { TechBadge } from "@/components/ui/TechBadge";
import { Reveal } from "@/components/ui/Reveal";
import { useGame } from "@/context/GameContext";

export function Hero() {
  const { setMode } = useGame();

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.16),transparent_32%),linear-gradient(#0b1220,#070b14)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            {profile.city}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] text-white sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-xl text-slate-200">{profile.title}</p>
          <p className="mt-5 max-w-xl font-display text-2xl text-cyan-100">
            {profile.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            {profile.subtitle}
          </p>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Expertise</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {signatureSkills.map((skill) => (
                <li key={skill.name}>
                  <TechBadge name={skill.name} icon={skill.icon} prominent />
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">Projects</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex rounded-full border border-violet-200/40 bg-violet-300/10 px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => setMode("explore")}>{profile.heroCta}</Button>
            <a
              href="#projects"
              className="inline-flex items-center rounded-full bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              View projects
            </a>
            <a
              href="/resume.pdf"
              className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold text-cyan-100 underline-offset-4 hover:underline"
            >
              Download resume
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl border border-cyan-200/30 bg-slate-900 font-display text-xl text-cyan-100"
                role="img"
                aria-label="Monogram placeholder. A profile photograph has not been added."
              >
                {profile.initials}
              </div>
              <div>
                <p className="text-sm text-slate-400">Profile image placeholder</p>
                <p className="font-medium text-white">{profile.name}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 p-3">
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-lg text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
