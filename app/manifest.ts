import type { MetadataRoute } from "next";
import { site } from "../lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Full Stack Engineer & CTO`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0b1a",
    theme_color: "#0a0e19",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
