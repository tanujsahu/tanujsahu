"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile, stats } from "@/data/profile";
import { projects } from "@/data/projects";
import { signatureSkills } from "@/data/skills";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";

export function IntroOverlay() {
  const { setMode } = useGame();
  const reduce = useReducedMotion();

  const content = (
    <div className="glass pointer-events-auto w-full max-w-xl rounded-3xl p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
        {profile.city}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-[0.95] text-white sm:text-6xl">
        {profile.name}
      </h1>
      <p className="mt-3 text-base text-slate-200 sm:text-lg">{profile.title}</p>
      <p className="mt-4 font-display text-xl text-cyan-100 sm:text-2xl">{profile.tagline}</p>
      <p className="mt-4 text-sm leading-6 text-slate-300">{profile.subtitle}</p>
      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">Expertise</p>
        <p className="mt-2 text-sm font-medium text-white">
          {signatureSkills.map((skill) => skill.name).join(" · ")}
        </p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200">Projects</p>
        <p className="mt-2 text-sm font-medium text-white">
          {projects.map((project) => project.name).join(" · ")}
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white/5 p-2 sm:p-3">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
              {stat.label}
            </dt>
            <dd className="mt-1 font-display text-sm text-white sm:text-lg">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => setMode("explore")}>{profile.heroCta}</Button>
        <Button variant="secondary" onClick={() => setMode("classic")}>
          {profile.classicCta}
        </Button>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        After you enter, walk with the arrows or WASD. Up moves forward, down moves back, and left and right move to the side, following the camera. Drag to look around. On a phone, use the joystick and drag the city to look around.
      </p>
    </div>
  );

  return (
    <div className="theme-scrim absolute inset-0 z-30 flex items-end bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 sm:items-center sm:bg-gradient-to-r sm:from-slate-950/75 sm:via-slate-950/25 sm:to-transparent sm:p-10">
      {reduce ? (
        content
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          {content}
        </motion.div>
      )}
    </div>
  );
}
