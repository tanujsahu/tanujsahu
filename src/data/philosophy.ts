export interface PhilosophyZone {
  id: string;
  title: string;
  statement: string;
  points: string[];
}

export const philosophy: PhilosophyZone[] = [
  {
    id: "scalability",
    title: "Scalability First",
    statement:
      "Designing systems with growth, performance, and maintainability in mind.",
    points: [
      "Separate workloads so features can grow without coupling the whole system.",
      "Choose data stores and service boundaries for the access pattern.",
      "Keep performance visible through architecture, not last-minute tuning.",
    ],
  },
  {
    id: "architecture",
    title: "Clean Architecture",
    statement:
      "Building modular, testable, and maintainable application structures.",
    points: [
      "Keep domain rules independent of framework details.",
      "Make modules replaceable behind clear interfaces.",
      "Design for tests at the boundary that is most likely to change.",
    ],
  },
  {
    id: "improvement",
    title: "Continuous Improvement",
    statement:
      "Using automation, testing, DevOps, and AI-assisted development to optimize workflows.",
    points: [
      "Automate delivery paths that people would otherwise repeat by hand.",
      "Treat tests as part of the design, not a trailing task.",
      "Use AI-assisted tools to accelerate review and implementation.",
    ],
  },
  {
    id: "leadership",
    title: "Leadership & Collaboration",
    statement:
      "Helping teams deliver reliable solutions through mentorship, communication, and technical planning.",
    points: [
      "Translate business requirements into technical plans the team can execute.",
      "Mentor developers through design reviews and pairing.",
      "Make architecture decisions explicit so delivery stays aligned.",
    ],
  },
];
