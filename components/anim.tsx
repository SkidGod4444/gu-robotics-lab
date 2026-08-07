"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale-style headline: each word rises out of its own clip mask.
 * The viewport observer must live on the un-clipped wrapper — a word
 * translated 115% inside overflow-hidden is fully clipped, and a fully
 * clipped element never "intersects", so it would never animate in.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  if (reduce) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span
            aria-hidden
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "115%" }}
              animate={inView ? { y: 0 } : { y: "115%" }}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.05,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
          </span>{" "}
        </span>
      ))}
    </span>
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  pad = 0,
  duration = 1.8,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => {
      let s = v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (pad) s = s.padStart(pad, "0");
      return `${prefix}${s}${suffix}`;
    };
    // Never overwrite the server-rendered final value while waiting —
    // if the observer misfires (e.g. some mobile browsers), the correct
    // number stays on screen instead of a stuck 0.
    if (!inView) return;
    if (reduce) {
      el.textContent = fmt(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, prefix, suffix, decimals, pad, duration]);

  const final = `${prefix}${to
    .toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .padStart(pad, "0")}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {final}
    </span>
  );
}

/** subtle scroll parallax wrapper */
export function Parallax({
  children,
  className,
  from = 36,
  to = -36,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** vertical rail that fills with scroll progress (for the stack section) */
export function ProgressRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-hairline" />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 top-0 w-px origin-top bg-ink"
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
      />
      {children}
    </div>
  );
}
