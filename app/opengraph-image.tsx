import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
      )
    ).text();
    const match = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
    );
    if (!match) return null;
    const res = await fetch(match[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [logo, humanoid, archivoBlack, archivoMedium] = await Promise.all([
    readFile(join(process.cwd(), "public/galgotias-logo.png")),
    readFile(join(process.cwd(), "public/humanoid-diagram.png")),
    loadGoogleFont("Archivo", 800),
    loadGoogleFont("Archivo", 500),
  ]);

  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const humanoidSrc = `data:image/png;base64,${humanoid.toString("base64")}`;

  const fonts = [];
  if (archivoBlack)
    fonts.push({
      name: "Archivo",
      data: archivoBlack,
      weight: 800 as const,
      style: "normal" as const,
    });
  if (archivoMedium)
    fonts.push({
      name: "Archivo",
      data: archivoMedium,
      weight: 500 as const,
      style: "normal" as const,
    });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#121316",
          fontFamily: "Archivo",
        }}
      >
        {/* exploded humanoid blueprint, right side */}
        <img
          src={humanoidSrc}
          alt=""
          style={{
            position: "absolute",
            right: -260,
            top: -30,
            width: 1150,
            opacity: 0.42,
          }}
        />
        {/* soft light */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "radial-gradient(circle at 74% 38%, rgba(255,255,255,0.09), rgba(255,255,255,0) 60%)",
          }}
        />
        {/* left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: 780,
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "rgba(245,245,244,0.6)",
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 9,
                height: 9,
                backgroundColor: "#f5f5f4",
              }}
            />
            GALGOTIAS UNIVERSITY · GREATER NOIDA
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: "#f5f5f4",
              fontSize: 63,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -2,
            }}
          >
            Building the Next Generation of Physical AI Engineers
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 27,
              fontWeight: 500,
              color: "rgba(245,245,244,0.68)",
            }}
          >
            Don&apos;t just program robots.&nbsp;
            <span style={{ color: "#f5f5f4", fontWeight: 800 }}>
              Build them.
            </span>
          </div>
          <img
            src={logoSrc}
            alt=""
            style={{ height: 46, width: 230, marginTop: 42 }}
          />
        </div>
        {/* fig caption */}
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 28,
            display: "flex",
            color: "rgba(245,245,244,0.45)",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: 3,
          }}
        >
          FIG. 01 — OPEN-SOURCE HUMANOID
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
