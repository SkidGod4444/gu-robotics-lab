"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export type LabItem = {
  name: string;
  note: string;
  value: string;
};

export type Glyph = "amr" | "ugv" | "arm" | "humanoid" | "quadruped" | "hand";

export type LabData = {
  id: string;
  name: string;
  glyph: Glyph;
  items: LabItem[];
  image?: { src: string; alt: string; width: number; height: number };
};

function GlyphIcon({ glyph }: { glyph: Glyph }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden {...common}>
      {glyph === "amr" && (
        <>
          <rect x="4" y="9" width="16" height="7" rx="2" />
          <circle cx="8.5" cy="18" r="1.8" />
          <circle cx="15.5" cy="18" r="1.8" />
          <path d="M12 9 V5.5 M9.5 5.5 h5" />
        </>
      )}
      {glyph === "ugv" && (
        <>
          <rect x="3.5" y="10" width="17" height="6" rx="1.5" />
          <circle cx="7" cy="18.2" r="1.9" />
          <circle cx="12" cy="18.2" r="1.9" />
          <circle cx="17" cy="18.2" r="1.9" />
          <path d="M17.5 10 L19.5 5" />
        </>
      )}
      {glyph === "arm" && (
        <>
          <path d="M5 20 L9.5 11.5 L16 13.5" />
          <path d="M16 13.5 L19 9.5 M19 9.5 l2 1.2 M19 9.5 l-0.4 2.4" />
          <circle cx="9.5" cy="11.5" r="1.6" />
          <circle cx="5" cy="20" r="1.9" />
          <path d="M2.5 21.9 h5" />
        </>
      )}
      {glyph === "humanoid" && (
        <>
          <rect x="9.5" y="3" width="5" height="4.5" rx="1.2" />
          <path d="M8 9.5 h8 l-1 6 h-6 z" />
          <path d="M8 10 L5.5 15 M16 10 L18.5 15" />
          <path d="M10 15.8 L9 21 M14 15.8 L15 21" />
        </>
      )}
      {glyph === "quadruped" && (
        <>
          <rect x="5" y="8" width="14" height="5" rx="1.5" />
          <path d="M7 13 l-1.5 4 l-1.5 0.5 M11 13 l-1 4.5 M13.5 13 l1 4.5 M17.5 13 l1.5 4 l1.5 0.5" />
          <path d="M19 8 l2.5 -1.5" />
        </>
      )}
      {glyph === "hand" && (
        <>
          <path d="M7 21 c-2 -2 -3 -5 -2.5 -8" />
          <path d="M7.5 13 V6.5 M10.5 12.5 V4.5 M13.5 12.5 V5 M16.5 13 V7" />
          <path d="M7.5 13 c0 4 1.5 6.5 4.5 8 c3 -1 4.5 -3.5 4.5 -8" />
        </>
      )}
    </svg>
  );
}

export default function LabCard({ lab }: { lab: LabData }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const px = useMotionValue(-300);
  const py = useMotionValue(-300);

  const rx = useSpring(useTransform(my, [0, 1], [4.5, -4.5]), {
    stiffness: 200,
    damping: 22,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-4.5, 4.5]), {
    stiffness: 200,
    damping: 22,
  });
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${px}px ${py}px, rgba(255,255,255,0.09), transparent 70%)`;

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mx.set(x / rect.width);
    my.set(y / rect.height);
    px.set(x);
    py.set(y);
  };
  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    px.set(-300);
    py.set(-300);
  };

  const num = lab.id.replace(/\D/g, "");

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.article
        ref={ref}
        onPointerMove={reduce ? undefined : onPointerMove}
        onPointerLeave={reduce ? undefined : onPointerLeave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        className="dot-grid group relative h-full overflow-hidden border border-line bg-forest p-7 text-cream transition-shadow duration-300 hover:shadow-[0_32px_70px_-24px_rgba(15,17,18,0.6)] sm:p-8"
      >
        {/* cursor spotlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        {/* scan beam */}
        <span aria-hidden className="scan-beam" />
        {/* viewfinder corners */}
        <span aria-hidden className="corner corner-tl" />
        <span aria-hidden className="corner corner-tr" />
        <span aria-hidden className="corner corner-bl" />
        <span aria-hidden className="corner corner-br" />
        {/* ghost numeral */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-7 right-3 select-none font-display text-[7.5rem] font-light leading-none text-cream/[0.05] transition-colors duration-500 group-hover:text-cream/[0.1]"
        >
          {num}
        </span>

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-cream/50 uppercase">
              {lab.id}
            </p>
            <h3 className="mt-2 font-display text-2xl font-light tracking-tight">
              {lab.name}
            </h3>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center border border-line text-cream/60 transition-colors duration-300 group-hover:border-line-strong group-hover:text-cream">
            <GlyphIcon glyph={lab.glyph} />
          </span>
        </div>

        {lab.image && (
          <div className="relative mt-6 flex h-52 items-center justify-center">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(240px_150px_at_50%_62%,rgba(255,255,255,0.07),transparent)]"
            />
            <Image
              src={lab.image.src}
              alt={lab.image.alt}
              width={lab.image.width}
              height={lab.image.height}
              className="relative h-full w-auto object-contain drop-shadow-[0_24px_44px_rgba(0,0,0,0.55)]"
            />
          </div>
        )}

        <ul className="relative mt-6 divide-y divide-line border-t border-line">
          {lab.items.map((item) => (
            <li
              key={item.name}
              className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 py-4"
            >
              <div>
                <p className="font-medium leading-snug">{item.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-cream/55">
                  {item.note}
                </p>
              </div>
              <p className="font-mono text-sm">{item.value}</p>
            </li>
          ))}
        </ul>
      </motion.article>
    </div>
  );
}
