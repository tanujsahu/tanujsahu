import {
  siAngular,
  siBitbucket,
  siClaude,
  siCursor,
  siCypress,
  siExpress,
  siGit,
  siGithubcopilot,
  siGitlab,
  siHarbor,
  siJasmine,
  siJavascript,
  siJenkins,
  siJest,
  siKubernetes,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNgrx,
  siNodedotjs,
  siReact,
  siTypescript,
} from "simple-icons";

interface BrandIcon {
  title: string;
  path: string;
  hex: string;
}

const icons: Record<string, BrandIcon> = {
  react: siReact,
  angular: siAngular,
  nextdotjs: siNextdotjs,
  javascript: siJavascript,
  typescript: siTypescript,
  ngrx: siNgrx,
  nodedotjs: siNodedotjs,
  express: siExpress,
  mongodb: siMongodb,
  mysql: siMysql,
  kubernetes: siKubernetes,
  jenkins: siJenkins,
  harbor: siHarbor,
  git: siGit,
  gitlab: siGitlab,
  bitbucket: siBitbucket,
  jest: siJest,
  jasmine: siJasmine,
  cypress: siCypress,
  cursor: siCursor,
  githubcopilot: siGithubcopilot,
  claude: siClaude,
};

const aliases: Record<string, string> = {
  "React.js": "react",
  Angular: "angular",
  "Next.js": "nextdotjs",
  JavaScript: "javascript",
  TypeScript: "typescript",
  NgRx: "ngrx",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  MongoDB: "mongodb",
  MySQL: "mysql",
  Kubernetes: "kubernetes",
  Jenkins: "jenkins",
  Harbor: "harbor",
  Git: "git",
  GitLab: "gitlab",
  Bitbucket: "bitbucket",
  Jest: "jest",
  Jasmine: "jasmine",
  Cypress: "cypress",
  Cursor: "cursor",
  "GitHub Copilot": "githubcopilot",
  Claude: "claude",
};

export function TechBadge({
  name,
  icon,
  prominent = false,
}: {
  name: string;
  icon?: string;
  prominent?: boolean;
}) {
  const slug = icon || aliases[name];
  const brand = slug ? icons[slug] : undefined;

  return (
    <span
      className={
        prominent
          ? "inline-flex items-center gap-2 rounded-full border border-cyan-200/45 bg-cyan-200/12 px-3.5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(103,232,249,0.12)]"
          : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100"
      }
    >
      {brand ? (
        <svg viewBox="0 0 24 24" className={prominent ? "h-5 w-5 shrink-0" : "h-4 w-4 shrink-0"} aria-hidden="true">
          <path d={brand.path} fill={`#${brand.hex}`} />
        </svg>
      ) : (
        <span
          aria-hidden="true"
          className="grid h-4 w-4 place-items-center rounded-full bg-slate-800 text-[9px] font-semibold text-cyan-100"
        >
          {name.slice(0, 1)}
        </span>
      )}
      {name}
    </span>
  );
}
