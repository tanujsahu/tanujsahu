"use client";

import { About } from "@/components/classic/About";
import { Contact } from "@/components/classic/Contact";
import { Education } from "@/components/classic/Education";
import { Experience } from "@/components/classic/Experience";
import { Hero } from "@/components/classic/Hero";
import { Philosophy } from "@/components/classic/Philosophy";
import { Projects } from "@/components/classic/Projects";
import { Skills } from "@/components/classic/Skills";
import { Navbar } from "@/components/ui/Navbar";
import { useGame } from "@/context/GameContext";

export function ClassicPortfolio() {
  const { setMode } = useGame();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navbar onExplore={() => setMode("explore")} />
      <main id="content">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Philosophy />
        <Education />
        <Contact />
      </main>
      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">
        Tanuj Sahu · Senior Full Stack Developer & Team Lead
      </footer>
    </div>
  );
}
