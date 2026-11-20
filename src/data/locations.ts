export type Facing = "north" | "south" | "east" | "west";

export type LocationKind =
  | "headquarters"
  | "tower"
  | "campus"
  | "project"
  | "lab"
  | "education"
  | "contact";

export type PanelId =
  | "about"
  | "experience"
  | "skills"
  | "project"
  | "philosophy"
  | "education"
  | "contact";

export interface CityLocation {
  id: string;
  name: string;
  shortName: string;
  district: string;
  summary: string;
  position: [number, number, number];
  size: [number, number, number];
  entrance: [number, number];
  facing: Facing;
  accent: string;
  emissive: string;
  kind: LocationKind;
  panel: PanelId;
  projectSlug?: string;
}

export const cityBounds = {
  minX: -42,
  maxX: 44,
  minZ: -42,
  maxZ: 30,
};

export const playerSpawn = { x: 0, z: 8.5, yaw: Math.PI };

export const locations: CityLocation[] = [
  {
    id: "headquarters",
    name: "Developer Headquarters",
    shortName: "Headquarters",
    district: "Central Plaza",
    summary: "Professional profile, introduction, and core expertise.",
    position: [0, 0, -6],
    size: [11, 7.2, 9],
    entrance: [0, 1.4],
    facing: "south",
    accent: "#67e8f9",
    emissive: "#155e75",
    kind: "headquarters",
    panel: "about",
  },
  {
    id: "experience",
    name: "Experience Tower",
    shortName: "Experience",
    district: "Professional Journey",
    summary: "Three companies, read floor by floor.",
    position: [0, 0, -31],
    size: [8.2, 18, 8.2],
    entrance: [0, -24.2],
    facing: "south",
    accent: "#c4b5fd",
    emissive: "#5b21b6",
    kind: "tower",
    panel: "experience",
  },
  {
    id: "technology",
    name: "Technology District",
    shortName: "Technology",
    district: "Technical Expertise",
    summary: "Departments for the tools and practices I use.",
    position: [30, 0, -6],
    size: [15, 5.4, 11],
    entrance: [19.6, -6],
    facing: "west",
    accent: "#38bdf8",
    emissive: "#0369a1",
    kind: "campus",
    panel: "skills",
  },
  {
    id: "architecture",
    name: "Architecture & Engineering Center",
    shortName: "Engineering",
    district: "Engineering Philosophy",
    summary: "How I approach scale, structure, improvement, and leadership.",
    position: [-30, 0, -7],
    size: [12, 6.2, 10],
    entrance: [-21.2, -7],
    facing: "east",
    accent: "#f0abfc",
    emissive: "#86198f",
    kind: "lab",
    panel: "philosophy",
  },
  {
    id: "education",
    name: "Education Campus",
    shortName: "Education",
    district: "Education",
    summary: "Bachelor of Computer Applications, CSJM University.",
    position: [-28, 0, -31],
    size: [11, 5.2, 8.6],
    entrance: [-28, -24.1],
    facing: "south",
    accent: "#fcd34d",
    emissive: "#92400e",
    kind: "education",
    panel: "education",
  },
  {
    id: "contact",
    name: "Contact & Collaboration Center",
    shortName: "Contact",
    district: "Collaboration",
    summary: "A direct way to start a conversation.",
    position: [29, 0, -31],
    size: [11, 4.8, 8.6],
    entrance: [29, -24.1],
    facing: "south",
    accent: "#fdba74",
    emissive: "#9a3412",
    kind: "contact",
    panel: "contact",
  },
  {
    id: "buildsync",
    name: "BuildSync",
    shortName: "BuildSync",
    district: "Innovation Park",
    summary: "Construction ERP and project management.",
    position: [-27, 0, 18],
    size: [6.4, 5.6, 6.4],
    entrance: [-27, 12.2],
    facing: "north",
    accent: "#22d3ee",
    emissive: "#155e75",
    kind: "project",
    panel: "project",
    projectSlug: "buildsync",
  },
  {
    id: "craveable-brands",
    name: "Craveable Brands",
    shortName: "Craveable",
    district: "Innovation Park",
    summary: "Restaurant enterprise backend systems.",
    position: [-16, 0, 18],
    size: [6.4, 4.8, 6.4],
    entrance: [-16, 12.2],
    facing: "north",
    accent: "#fbbf24",
    emissive: "#92400e",
    kind: "project",
    panel: "project",
    projectSlug: "craveable-brands",
  },
  {
    id: "puremind",
    name: "Puremind",
    shortName: "Puremind",
    district: "Innovation Park",
    summary: "Healthcare and telehealth platform.",
    position: [-5, 0, 18],
    size: [6.4, 5.2, 6.4],
    entrance: [-5, 12.2],
    facing: "north",
    accent: "#a78bfa",
    emissive: "#5b21b6",
    kind: "project",
    panel: "project",
    projectSlug: "puremind",
  },
  {
    id: "gymcatch",
    name: "Gymcatch",
    shortName: "Gymcatch",
    district: "Innovation Park",
    summary: "Fitness booking and business operations.",
    position: [6, 0, 18],
    size: [6.4, 4.6, 6.4],
    entrance: [6, 12.2],
    facing: "north",
    accent: "#34d399",
    emissive: "#065f46",
    kind: "project",
    panel: "project",
    projectSlug: "gymcatch",
  },
  {
    id: "oralift",
    name: "Oralift",
    shortName: "Oralift",
    district: "Innovation Park",
    summary: "Health and wellness tracking.",
    position: [17, 0, 18],
    size: [6.4, 5.4, 6.4],
    entrance: [17, 12.2],
    facing: "north",
    accent: "#fb7185",
    emissive: "#9f1239",
    kind: "project",
    panel: "project",
    projectSlug: "oralift",
  },
  {
    id: "roezy",
    name: "Roezy",
    shortName: "Roezy",
    district: "Innovation Park",
    summary: "Automotive service management.",
    position: [28, 0, 18],
    size: [6.4, 5, 6.4],
    entrance: [28, 12.2],
    facing: "north",
    accent: "#38bdf8",
    emissive: "#075985",
    kind: "project",
    panel: "project",
    projectSlug: "roezy",
  },
];

export function getLocation(id: string) {
  return locations.find((location) => location.id === id);
}

export function getLocationBySlug(slug: string) {
  return locations.find((location) => location.projectSlug === slug);
}
