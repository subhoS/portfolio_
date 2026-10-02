import type { MetadataRoute } from "next";
import { site } from "../lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Full Stack Engineer & CTO`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e19",
    theme_color: "#0a0e19",
    icons: [
      { src: "/icon.png", sizes: "640x640", type: "image/png", purpose: "any" },
      {
        src: "/apple-icon.png",
        sizes: "640x640",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
