import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/portfolio/ProjectCaseStudy";
import { Navbar } from "@/components/ui/Navbar";
import { getProject, projects } from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navbar home={false} />
      <main id="content" className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <ProjectCaseStudy project={project} />
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/?view=classic#projects" className="text-cyan-100 underline-offset-4 hover:underline">
            Back to portfolio
          </Link>
          <Link
            href={`/?view=city&focus=${project.slug}`}
            className="text-cyan-100 underline-offset-4 hover:underline"
          >
            Visit this building
          </Link>
        </div>
      </main>
    </div>
  );
}
