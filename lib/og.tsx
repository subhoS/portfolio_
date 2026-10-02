import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./site";

export const siteHost = new URL(site.url).host.replace(/^www\./, "");

export const ogSize = { width: 1200, height: 630 };

const fontFile = (pkg: string, file: string) =>
  fs.readFile(
    path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file),
  );

async function loadFonts() {
  const [regular, bold, black, serif] = await Promise.all([
    fontFile("inter", "inter-latin-400-normal.woff"),
    fontFile("inter", "inter-latin-700-normal.woff"),
    fontFile("inter", "inter-latin-800-normal.woff"),
    fontFile("instrument-serif", "instrument-serif-latin-400-italic.woff"),
  ]);
  return [
    {
      name: "Inter",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: black,
      weight: 800 as const,
      style: "normal" as const,
    },
    {
      name: "Serif",
      data: serif,
      weight: 400 as const,
      style: "italic" as const,
    },
  ];
}

async function avatarDataUrl() {
  const buf = await fs.readFile(
    path.join(process.cwd(), "public", "subhadeep-datta.jpg"),
  );
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function logoDataUrl() {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "logo.svg"));
  return `data:image/svg+xml;base64,${buf.toString("base64")}`;
}

const bg = {
  background: "#0a0e19",
  backgroundImage:
    "radial-gradient(circle at 88% 0%, rgba(139,92,246,0.55), transparent 45%), radial-gradient(circle at 0% 100%, rgba(219,39,119,0.28), transparent 40%)",
};

type OgInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
};

export async function renderOg({
  eyebrow,
  title,
  subtitle,
  footer = siteHost,
}: OgInput) {
  const [fonts, avatar, logo] = await Promise.all([
    loadFonts(),
    avatarDataUrl(),
    logoDataUrl(),
  ]);
  const titleSize = title.length > 90 ? 52 : title.length > 60 ? 60 : 70;

  return new ImageResponse(
    <div
      style={{
        ...bg,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        fontFamily: "Inter",
        color: "#f4f2fb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 22,
          color: "#c4b5fd",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: satori renders plain img only */}
        <img
          src={logo}
          width={52}
          height={52}
          alt=""
          style={{ marginRight: 8 }}
        />
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "Serif",
              fontStyle: "italic",
              fontSize: 38,
              color: "#cfc8ea",
              lineHeight: 1.2,
              maxWidth: 980,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* biome-ignore lint/performance/noImgElement: satori renders plain img only */}
          <img
            src={avatar}
            width={64}
            height={64}
            style={{
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.25)",
            }}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>Subhadeep Datta</div>
            <div style={{ fontSize: 20, color: "#a9a3c2" }}>
              Full Stack Engineer &amp; CTO
            </div>
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#a9a3c2" }}>{footer}</div>
      </div>
    </div>,
    { ...ogSize, fonts },
  );
}
