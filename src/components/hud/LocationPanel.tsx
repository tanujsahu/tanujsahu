"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { experience } from "@/data/experience";
import { getLocation } from "@/data/locations";
import { philosophy } from "@/data/philosophy";
import { education, profile } from "@/data/profile";
import { getProject } from "@/data/projects";
import { signatureSkills, skillGroups } from "@/data/skills";
import { PhilosophyDiagram } from "@/components/portfolio/PhilosophyDiagram";
import { ProjectCaseStudy } from "@/components/portfolio/ProjectCaseStudy";
import { ContactForm } from "@/components/ui/ContactForm";
import { TechBadge } from "@/components/ui/TechBadge";
import { useGame } from "@/context/GameContext";

export function LocationPanel() {
  const { activeId, closeLocation, interior } = useGame();
  const panelRef = useRef<HTMLDivElement>(null);
  const location = activeId ? getLocation(activeId) : undefined;

  useEffect(() => {
    const root = panelRef.current;
    if (!root || !location) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [location]);

  if (!location) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-end sm:items-stretch">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/25 sm:bg-slate-950/35"
        aria-label="Close location"
        onClick={closeLocation}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-title"
        className={`glass pointer-events-auto relative flex w-full flex-col rounded-t-3xl sm:h-full sm:max-w-xl sm:rounded-none ${
          interior === "contact" ? "max-h-[46vh] sm:max-h-none" : "max-h-[78vh] sm:max-h-none"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{location.district}</p>
            <h2 id="location-title" className="mt-1 font-display text-xl text-white sm:text-2xl">
              {location.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeLocation}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <LocationBody id={location.id} panel={location.panel} projectSlug={location.projectSlug} />
        </div>
      </div>
    </div>
  );
}

function LocationBody({
  id,
  panel,
  projectSlug,
}: {
  id: string;
  panel: string;
  projectSlug?: string;
}) {
  if (panel === "about") return <AboutBody />;
  if (panel === "experience") return <ExperienceBody />;
  if (panel === "skills") return <SkillsBody />;
  if (panel === "philosophy") return <PhilosophyBody />;
  if (panel === "education") return <EducationBody />;
  if (panel === "contact") return <ContactBody />;
  if (panel === "project" && projectSlug) {
    const project = getProject(projectSlug);
    if (!project) return null;
    return (
      <div className="space-y-6">
        <ProjectCaseStudy project={project} variant="panel" />
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white"
        >
          Open dedicated case study
        </Link>
      </div>
    );
  }
  return <p className="text-sm text-slate-300">This location is {id}.</p>;
}

function AboutBody() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div
          className="grid h-16 w-16 place-items-center rounded-2xl border border-cyan-200/30 bg-slate-900 font-display text-xl text-cyan-100"
          role="img"
          aria-label="Monogram placeholder. A profile photograph has not been added."
        >
          {profile.initials}
        </div>
        <div>
          <p className="font-display text-xl text-white">{profile.name}</p>
          <p className="text-sm text-slate-300">{profile.title}</p>
        </div>
      </div>
      <p className="font-display text-lg text-cyan-100">{profile.tagline}</p>
      <p className="text-sm leading-6 text-slate-300">{profile.introduction}</p>
      <p className="text-sm leading-6 text-slate-300">{profile.approach}</p>
      <ul className="flex flex-wrap gap-2">
        {profile.focus.map((item) => (
          <li key={item} className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-100">
            {item}
          </li>
        ))}
      </ul>
      <a href="/resume.pdf" className="inline-flex text-sm font-semibold text-cyan-100 underline-offset-4 hover:underline">
        Download resume summary
      </a>
    </div>
  );
}

function ExperienceBody() {
  const [floor, setFloor] = useState(0);
  const role = experience[floor];

  return (
    <div>
      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Experience floors">
        {experience.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={floor === index}
            onClick={() => setFloor(index)}
            className={`rounded-2xl border px-2 py-3 text-left text-xs ${
              floor === index
                ? "border-violet-300 bg-violet-300/15 text-white"
                : "border-white/10 text-slate-300"
            }`}
          >
            <span className="block text-[10px] uppercase tracking-wide text-violet-200">
              Floor {experience.length - index}
            </span>
            {item.company}
          </button>
        ))}
      </div>
      <article className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-display text-2xl text-white">{role.company}</h3>
        <p className="mt-1 text-sm text-cyan-100">{role.role}</p>
        <p className="mt-1 text-sm text-slate-400">{role.period}</p>
        <ul className="mt-4 space-y-2">
          {role.highlights.map((highlight) => (
            <li key={highlight} className="text-sm leading-6 text-slate-300">
              {highlight}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function SkillsBody() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((item) => item.id === active) ?? skillGroups[0];

  return (
    <div>
      <div className="rounded-3xl border border-cyan-200/35 bg-cyan-200/10 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
          Core expertise
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {signatureSkills.map((skill) => (
            <li key={skill.name}>
              <TechBadge name={skill.name} icon={skill.icon} prominent />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {skillGroups.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={`rounded-full px-3 py-1 text-xs ${
              active === item.id ? "bg-cyan-200 text-slate-950" : "bg-white/10 text-slate-200"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">{group.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <li key={skill.name}>
            <TechBadge name={skill.name} icon={skill.icon} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhilosophyBody() {
  const [active, setActive] = useState(philosophy[0].id);
  const zone = philosophy.find((item) => item.id === active) ?? philosophy[0];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {philosophy.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={`rounded-2xl border px-3 py-2 text-left text-sm ${
              active === item.id
                ? "border-fuchsia-300/60 bg-fuchsia-300/10 text-white"
                : "border-white/10 text-slate-300"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <PhilosophyDiagram id={zone.id} />
        <h3 className="mt-2 font-display text-xl text-white">{zone.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{zone.statement}</p>
        <ul className="mt-3 space-y-2">
          {zone.points.map((point) => (
            <li key={point} className="text-sm leading-6 text-slate-400">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EducationBody() {
  return (
    <article className="rounded-3xl border border-amber-200/20 bg-amber-200/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Degree</p>
      <h3 className="mt-2 font-display text-2xl text-white">{education.degree}</h3>
      <p className="mt-2 text-slate-200">{education.institution}</p>
      <p className="mt-2 text-sm text-slate-400">
        {education.yearLabel}: {education.year}
      </p>
    </article>
  );
}

function ContactBody() {
  const { interior, drink, serveDrink, leaveLounge } = useGame();
  return (
    <div className="space-y-5">
      {interior === "contact" ? (
        <div className="rounded-2xl border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-sm leading-6 text-amber-50">
          <p>You are in the lounge, with a sofa, table, and coffee machine.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50"
              onClick={() => serveDrink("coffee")}
            >
              {drink === "coffee" ? "Drinking coffee" : "Coffee"}
            </button>
            <button
              type="button"
              className="rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950"
              onClick={() => serveDrink("tea")}
            >
              {drink === "tea" ? "Drinking tea" : "Tea"}
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
              onClick={leaveLounge}
            >
              Step outside
            </button>
          </div>
        </div>
      ) : null}
      <div>
        <h3 className="font-display text-2xl text-white">{profile.contactHeading}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{profile.contactDescription}</p>
      </div>
      <ul className="space-y-2 text-sm">
        <li>
          <a className="inline-flex items-center gap-2 text-cyan-100" href={`mailto:${profile.email}`}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            {profile.email}
          </a>
        </li>
        <li>
          <a className="inline-flex items-center gap-2 text-cyan-100" href={profile.phoneHref}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            {profile.phone}
          </a>
        </li>
        <li className="inline-flex items-center gap-2 text-slate-300">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {profile.locationLabel}
        </li>
        <li>
          <a className="text-cyan-100 underline-offset-4 hover:underline" href={profile.github} target="_blank" rel="noreferrer">
            GitHub profile
          </a>
        </li>
      </ul>
      <ContactForm />
    </div>
  );
}
