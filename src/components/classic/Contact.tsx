"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { profile } from "@/data/profile";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Collaboration Center" title={profile.contactHeading}>
        {profile.contactDescription}
      </SectionHeading>
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="glass h-full rounded-3xl p-6">
            <ul className="space-y-4 text-sm">
              <li>
                <a className="flex gap-3 text-slate-200 hover:text-white" href={`mailto:${profile.email}`}>
                  <Mail className="mt-0.5 h-4 w-4 text-cyan-200" aria-hidden="true" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a className="flex gap-3 text-slate-200 hover:text-white" href={profile.phoneHref}>
                  <Phone className="mt-0.5 h-4 w-4 text-cyan-200" aria-hidden="true" />
                  {profile.phone}
                </a>
              </li>
              <li className="flex gap-3 text-slate-200">
                <MapPin className="mt-0.5 h-4 w-4 text-cyan-200" aria-hidden="true" />
                {profile.locationLabel}
              </li>
              <li>
                <a
                  className="text-cyan-100 underline-offset-4 hover:underline"
                  href={profile.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  {profile.githubLabel}
                </a>
              </li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="glass rounded-3xl p-6">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
