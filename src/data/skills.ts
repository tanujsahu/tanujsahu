export interface Skill {
  name: string;
  /** simple-icons slug, when a real brand mark exists */
  icon?: string;
}

export const signatureSkillNames = [
  "React.js",
  "Next.js",
  "Angular",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Kubernetes",
] as const;

export interface SkillGroup {
  id: string;
  title: string;
  summary: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    summary: "Interfaces, design systems, and client application architecture.",
    skills: [
      { name: "React.js", icon: "react" },
      { name: "Angular", icon: "angular" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "NgRx", icon: "ngrx" },
    ],
  },
  {
    id: "backend",
    title: "Backend Engineering",
    summary: "Services, APIs, and distributed application backends.",
    skills: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Express.js", icon: "express" },
      { name: "REST APIs" },
      { name: "Microservices" },
      { name: "Serverless Architecture" },
    ],
  },
  {
    id: "database",
    title: "Database Systems",
    summary: "Operational data stores for product and enterprise workloads.",
    skills: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "DynamoDB" },
      { name: "MySQL", icon: "mysql" },
      { name: "ORMs" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    summary: "AWS services, delivery pipelines, and source control.",
    skills: [
      { name: "AWS Lambda" },
      { name: "Amazon S3" },
      { name: "Amazon RDS" },
      { name: "AWS Cognito" },
      { name: "AWS KMS" },
      { name: "AWS CloudWatch" },
      { name: "AWS Amplify" },
      { name: "Amazon CloudFront" },
      { name: "Amazon SQS" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Jenkins", icon: "jenkins" },
      { name: "Harbor", icon: "harbor" },
      { name: "Git", icon: "git" },
      { name: "GitLab", icon: "gitlab" },
      { name: "Bitbucket", icon: "bitbucket" },
    ],
  },
  {
    id: "testing",
    title: "Testing & Quality Engineering",
    summary: "Automated checks across units, components, and user flows.",
    skills: [
      { name: "Jest", icon: "jest" },
      { name: "Karma" },
      { name: "Jasmine", icon: "jasmine" },
      { name: "Cypress", icon: "cypress" },
      { name: "Unit Testing" },
      { name: "End-to-End Testing" },
    ],
  },
  {
    id: "ai",
    title: "AI-Assisted Development",
    summary: "Tools used to support implementation, review, and delivery.",
    skills: [
      { name: "Cursor", icon: "cursor" },
      { name: "GitHub Copilot", icon: "githubcopilot" },
      { name: "Claude", icon: "claude" },
      { name: "KubeGPT" },
    ],
  },
  {
    id: "practices",
    title: "Engineering Practices",
    summary: "How teams plan, design, and ship reliable software.",
    skills: [
      { name: "Agile Development" },
      { name: "HLD/LLD" },
      { name: "Team Leadership" },
      { name: "Software Architecture" },
      { name: "SDLC Optimization" },
    ],
  },
];

export const signatureSkills = signatureSkillNames.flatMap((name) => {
  const skill = skillGroups.flatMap((group) => group.skills).find((item) => item.name === name);
  return skill ? [skill] : [];
});
