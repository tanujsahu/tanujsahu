import { writeFileSync } from "node:fs";

const lines = [
  "TANUJ SAHU",
  "Senior Full Stack Developer & Team Lead",
  "Malviya Nagar, Jaipur, Rajasthan, India",
  "tanujsahu09@gmail.com | +91 7651953660",
  "https://github.com/tanujsahu/Projects",
  "",
  "This PDF is a text summary generated from the portfolio profile.",
  "Replace public/resume.pdf with an official resume when you have one.",
  "",
  "SUMMARY",
  "I'm Tanuj Sahu, a Senior Full Stack Developer and Team Lead based in",
  "Jaipur, India. With over six years of experience, I specialize in",
  "designing and building scalable enterprise applications using MERN/MEAN",
  "technologies, Next.js, microservices, and AWS serverless architectures.",
  "",
  "I enjoy transforming complex business requirements into reliable",
  "technical solutions while mentoring developers, leading teams, and",
  "designing scalable application architectures.",
  "",
  "EXPERIENCE",
  "HG Technologies - Senior Full Stack Developer & Team Lead",
  "July 2025 - Present",
  "- Leading cross-functional development teams.",
  "- Overseeing end-to-end enterprise project delivery.",
  "- Architecting scalable MEAN/MERN and Next.js applications.",
  "- Designing HLD and LLD system architectures.",
  "- Developing microservices and high-performance applications.",
  "- Mentoring developers and aligning engineering decisions with business requirements.",
  "",
  "Dotsquares - Full Stack Developer",
  "February 2022 - July 2025",
  "- Developed Angular and React.js applications.",
  "- Implemented NgRx state management.",
  "- Built backend services using Node.js and Express.js.",
  "- Worked with MongoDB, MySQL, and ORMs.",
  "- Developed serverless and microservices-based systems.",
  "- Implemented unit testing using Jest.",
  "- Contributed to technical delivery and project milestones.",
  "",
  "EMW Technology - MEAN Stack Developer",
  "August 2020 - January 2022",
  "- Built responsive Angular interfaces.",
  "- Developed backend applications using Node.js and Express.js.",
  "- Managed application data using MongoDB.",
  "- Improved application maintainability and scalability.",
  "- Delivered full-stack application features.",
  "",
  "EDUCATION",
  "Bachelor of Computer Applications (BCA)",
  "CSJM University, Kanpur",
  "Graduation Year: 2019",
  "",
  "FEATURED PROJECTS",
  "BuildSync - Senior Full Stack Developer / Lead Developer",
  "Construction ERP & Project Management",
  "Craveable Brands - Backend Developer",
  "Food & Restaurant Enterprise Systems",
  "Puremind - MEAN Stack Developer",
  "Healthcare & Telehealth",
  "Gymcatch - Angular Developer",
  "Fitness & Booking Management",
  "Oralift - Full Stack Developer",
  "Health & Wellness Technology",
  "Roezy - Full Stack Developer",
  "Automotive Service Management",
];

const escaped = lines.map((line) =>
  line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)"),
);

const commands = ["BT", "/F1 10 Tf", "48 790 Td", "11.4 TL"];
for (const line of escaped) {
  commands.push(`(${line}) Tj`, "T*");
}
commands.push("ET");
const stream = commands.join("\n");

const objects = [
  "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
  "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
  "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n",
  `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream\nendobj\n`,
  "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n",
];

let pdf = "%PDF-1.4\n";
const offsets = [0];
for (const object of objects) {
  offsets.push(pdf.length);
  pdf += object;
}
const xref = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let index = 1; index < offsets.length; index += 1) {
  pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

writeFileSync(new URL("../public/resume.pdf", import.meta.url), pdf);
console.log("Wrote public/resume.pdf");
