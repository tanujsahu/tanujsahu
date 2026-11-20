export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export const experience: ExperienceRole[] = [
  {
    id: "hg-technologies",
    company: "HG Technologies",
    role: "Senior Full Stack Developer & Team Lead",
    period: "July 2025 – Present",
    highlights: [
      "Leading cross-functional development teams.",
      "Overseeing end-to-end enterprise project delivery.",
      "Architecting scalable MEAN/MERN and Next.js applications.",
      "Designing HLD and LLD system architectures.",
      "Developing microservices and high-performance applications.",
      "Mentoring developers and aligning engineering decisions with business requirements.",
    ],
  },
  {
    id: "dotsquares",
    company: "Dotsquares",
    role: "Full Stack Developer",
    period: "February 2022 – July 2025",
    highlights: [
      "Developed Angular and React.js applications.",
      "Implemented NgRx state management.",
      "Built backend services using Node.js and Express.js.",
      "Worked with MongoDB, MySQL, and ORMs.",
      "Developed serverless and microservices-based systems.",
      "Implemented unit testing using Jest.",
      "Contributed to technical delivery and project milestones.",
    ],
  },
  {
    id: "emw-technology",
    company: "EMW Technology",
    role: "MEAN Stack Developer",
    period: "August 2020 – January 2022",
    highlights: [
      "Built responsive Angular interfaces.",
      "Developed backend applications using Node.js and Express.js.",
      "Managed application data using MongoDB.",
      "Improved application maintainability and scalability.",
      "Delivered full-stack application features.",
    ],
  },
];
