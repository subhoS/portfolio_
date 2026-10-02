import { ogSize, renderOg } from "../lib/og";

export const alt = "Subhadeep Datta — Full Stack Engineer & CTO";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Portfolio & Writing",
    title: "Subhadeep Datta",
    subtitle: "Full Stack Engineer & CTO building systems that scale. Hirerkey · Noisiv Consulting · Qid",
  });
}
