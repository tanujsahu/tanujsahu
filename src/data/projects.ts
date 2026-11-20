export interface Project {
  slug: string;
  name: string;
  category: string;
  role: string;
  description: string;
  responsibilities: string[];
  technologies?: string[];
  demoUrl?: string;
  repositoryUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "buildsync",
    name: "BuildSync",
    category: "Construction ERP & Project Management",
    role: "Senior Full Stack Developer / Lead Developer",
    description:
      "A cloud-based construction ERP and project management platform designed to streamline procurement, inventory management, project planning, business workflows, and reporting.",
    responsibilities: [
      "Led development of scalable full-stack solutions.",
      "Built enterprise modules and workflows.",
      "Developed backend services using Node.js and Express.js.",
      "Worked on Next.js application development.",
      "Integrated cloud storage and deployment infrastructure.",
      "Worked with Kubernetes, Jenkins, and Harbor.",
    ],
    technologies: [
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AWS S3",
      "AWS Amplify",
      "Kubernetes",
      "Jenkins",
      "Harbor",
    ],
  },
  {
    slug: "craveable-brands",
    name: "Craveable Brands",
    category: "Food & Restaurant Enterprise Systems",
    role: "Backend Developer",
    description:
      "Developed scalable backend microservices supporting restaurant brands including Red Rooster and Oporto.",
    responsibilities: [
      "Built microservices-based backend architecture.",
      "Worked with DynamoDB.",
      "Leveraged AWS serverless technologies.",
      "Used Amazon CloudFront and Amazon SQS.",
    ],
    technologies: [
      "Microservices",
      "DynamoDB",
      "AWS Serverless",
      "CloudFront",
      "SQS",
    ],
  },
  {
    slug: "puremind",
    name: "Puremind",
    category: "Healthcare & Telehealth",
    role: "MEAN Stack Developer",
    description:
      "A healthcare platform combining virtual doctor consultations and PVR therapy to provide convenient and personalized patient care.",
    responsibilities: [
      "Developed frontend functionality using Angular.",
      "Built backend services using Node.js.",
      "Worked with serverless architecture.",
      "Supported scalable healthcare application functionality.",
    ],
    technologies: ["Angular", "Node.js", "Serverless Architecture"],
  },
  {
    slug: "gymcatch",
    name: "Gymcatch",
    category: "Fitness & Booking Management",
    role: "Angular Developer",
    description:
      "A fitness business management platform that simplifies bookings and operational workflows.",
    responsibilities: [
      "Developed interactive Angular interfaces.",
      "Implemented NgRx state management.",
      "Wrote unit tests using Karma and Jasmine.",
      "Created end-to-end tests using Cypress.",
      "Worked with microservices-based architecture.",
    ],
    technologies: [
      "Angular",
      "NgRx",
      "Karma",
      "Jasmine",
      "Cypress",
      "Microservices",
    ],
  },
  {
    slug: "oralift",
    name: "Oralift",
    category: "Health & Wellness Technology",
    role: "Full Stack Developer",
    description:
      "A health and wellness tracking application integrating wearable-device data, photos, and videos to monitor fitness activities and measure user progress.",
    responsibilities: [
      "Developed health and wellness tracking functionality.",
      "Integrated wearable-related activity information.",
      "Implemented fitness-session analysis.",
      "Supported personalized next-session recommendations.",
      "Generated progress reports.",
    ],
  },
  {
    slug: "roezy",
    name: "Roezy",
    category: "Automotive Service Management",
    role: "Full Stack Developer",
    description:
      "A car service management platform that automates business workflows, converts email-based service requests into operational tasks, and streamlines invoicing and customer approvals.",
    responsibilities: [
      "Developed service request processing workflows.",
      "Implemented invoice generation.",
      "Built technician task assignment workflows.",
      "Enabled repair progress tracking.",
      "Implemented client approval functionality.",
      "Developed business reports.",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
