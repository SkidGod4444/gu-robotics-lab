"use client";

import { useEffect, useRef } from "react";

const VW = 560;
const VH = 520;
const BX = 280;
const BY = 436;
const L1 = 185;
const L2 = 145;
const RMAX = L1 + L2 - 6;
const RMIN = 70;

const rad = (deg: number) => (deg * Math.PI) / 180;

const envStart = {
  x: BX + RMAX * Math.cos(rad(190)),
  y: BY + RMAX * Math.sin(rad(190)),
};
const envEnd = {
  x: BX + RMAX * Math.cos(rad(350)),
  y: BY + RMAX * Math.sin(rad(350)),
};
const ENVELOPE = `M ${envStart.x.toFixed(1)} ${envStart.y.toFixed(1)} A ${RMAX} ${RMAX} 0 0 1 ${envEnd.x.toFixed(1)} ${envEnd.y.toFixed(1)}`;

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

/** clamp a target into the arm's reachable workspace, above the ground line */
function clampTarget(x: number, y: number) {
  const ty = Math.min(y, BY - 14);
  let dx = x - BX;
  let dy = ty - BY;
  const d = Math.hypot(dx, dy) || 1;
  const r = clamp(d, RMIN, RMAX);
  dx = (dx / d) * r;
  dy = (dy / d) * r;
  return { x: BX + dx, y: BY + dy };
}

/** analytic 2-link IK, elbow-up configuration */
function solveIK(tx: number, ty: number) {
  const dx = tx - BX;
  const dy = ty - BY;
  const d = clamp(Math.hypot(dx, dy), RMIN, RMAX);
  const c2 = clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1);
  const t2 = Math.acos(c2);
  let best = { a1: 0, a2: 0, ey: Infinity };
  for (const s of [1, -1]) {
    const a2 = s * t2;
    const a1 =
      Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
    const ey = BY + L1 * Math.sin(a1);
    if (ey < best.ey) best = { a1, a2, ey };
  }
  return best;
}

const fmtAngle = (radians: number) => {
  const deg = (-radians * 180) / Math.PI; // sign flipped so "up" reads positive
  const sign = deg < 0 ? "-" : "+";
  return `${sign}${Math.abs(deg).toFixed(1).padStart(5, "0")}°`;
};

export default function RobotArm() {
  const svgRef = useRef<SVGSVGElement>(null);
  const link1Ref = useRef<SVGGElement>(null);
  const link2Ref = useRef<SVGGElement>(null);
  const targetRef = useRef<SVGGElement>(null);
  const j1Ref = useRef<SVGTextElement>(null);
  const j2Ref = useRef<SVGTextElement>(null);
  const eeRef = useRef<SVGTextElement>(null);
  const statusRef = useRef<SVGTextElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const apply = (tx: number, ty: number, tracking: boolean) => {
      const { a1, a2 } = solveIK(tx, ty);
      const ex = BX + L1 * Math.cos(a1);
      const ey = BY + L1 * Math.sin(a1);
      const wx = ex + L2 * Math.cos(a1 + a2);
      const wy = ey + L2 * Math.sin(a1 + a2);
      const d1 = (a1 * 180) / Math.PI;
      const d12 = ((a1 + a2) * 180) / Math.PI;
      link1Ref.current?.setAttribute("transform", `rotate(${d1} ${BX} ${BY})`);
      link2Ref.current?.setAttribute(
        "transform",
        `translate(${ex} ${ey}) rotate(${d12})`,
      );
      targetRef.current?.setAttribute("transform", `translate(${tx} ${ty})`);
      if (j1Ref.current) j1Ref.current.textContent = `J1  ${fmtAngle(a1)}`;
      if (j2Ref.current) j2Ref.current.textContent = `J2  ${fmtAngle(a2)}`;
      if (eeRef.current)
        eeRef.current.textContent = `EE  X ${wx.toFixed(0).padStart(3, "0")}  Z ${Math.max(0, BY - wy)
          .toFixed(0)
          .padStart(3, "0")}`;
      if (statusRef.current)
        statusRef.current.textContent = tracking ? "TRACKING" : "PATROL";
      dotRef.current?.setAttribute("fill", tracking ? "#ffb300" : "#9ad8b4");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = clampTarget(BX + 175, BY - 195);
      apply(t.x, t.y, false);
      if (statusRef.current) statusRef.current.textContent = "HOLD";
      return;
    }

    // arm wakes up folded at its side, then eases to wherever it's headed
    const cur = { x: BX - 240, y: BY - 40 };
    let pointerGoal: { x: number; y: number } | null = null;
    let lastMove = -Infinity;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;
      const sx = ((e.clientX - rect.left) / rect.width) * VW;
      const sy = ((e.clientY - rect.top) / rect.height) * VH;
      pointerGoal = clampTarget(sx, sy);
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (now: number) => {
      const tracking = now - lastMove < 2500 && pointerGoal !== null;
      let goal: { x: number; y: number };
      if (tracking && pointerGoal) {
        goal = pointerGoal;
      } else {
        // patrol: slow lissajous sweep of the upper workspace
        const t = now / 1000;
        const ang = -Math.PI / 2 + 1.05 * Math.sin(t * 0.33);
        const r = 220 + 78 * Math.sin(t * 0.51 + 1);
        goal = clampTarget(BX + r * Math.cos(ang), BY + r * Math.sin(ang));
      }
      cur.x += (goal.x - cur.x) * 0.085;
      cur.y += (goal.y - cur.y) * 0.085;
      apply(cur.x, cur.y, tracking);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      role="img"
      aria-label="instrument display of a two-link robot arm that follows the cursor"
      className="w-full h-auto select-none"
    >
      {/* workspace envelope */}
      <path
        d={ENVELOPE}
        fill="none"
        stroke="var(--hud)"
        strokeWidth="1.2"
        strokeDasharray="7 6"
        opacity="0.45"
      />
      <text
        x={BX + (RMAX + 10) * Math.cos(rad(305))}
        y={BY + (RMAX + 10) * Math.sin(rad(305))}
        className="font-mono"
        fontSize="10.5"
        fill="var(--hud)"
        opacity="0.85"
      >
        r ≈ 330 mm
      </text>

      {/* ground line + hatching */}
      <line
        x1={BX - 118}
        y1={BY + 30}
        x2={BX + 118}
        y2={BY + 30}
        stroke="var(--fog)"
        strokeWidth="2.5"
      />
      {Array.from({ length: 15 }, (_, i) => (
        <line
          key={i}
          x1={BX - 112 + i * 16}
          y1={BY + 30}
          x2={BX - 122 + i * 16}
          y2={BY + 42}
          stroke="var(--fog)"
          strokeWidth="1.4"
          opacity="0.4"
        />
      ))}

      {/* base pedestal */}
      <path
        d={`M ${BX - 42} ${BY + 30} L ${BX - 26} ${BY + 2} L ${BX + 26} ${BY + 2} L ${BX + 42} ${BY + 30} Z`}
        fill="var(--panel)"
        stroke="var(--fog)"
        strokeWidth="2.5"
      />
      <circle cx={BX - 30} cy={BY + 24} r="3" fill="var(--fog)" />
      <circle cx={BX + 30} cy={BY + 24} r="3" fill="var(--fog)" />

      {/* target crosshair */}
      <g ref={targetRef} transform={`translate(${BX - 240} ${BY - 40})`}>
        <circle
          r="10"
          fill="none"
          stroke="var(--hud)"
          strokeWidth="1.4"
          strokeDasharray="4 3"
        />
        <line x1="-16" y1="0" x2="-6" y2="0" stroke="var(--hud)" strokeWidth="1.4" />
        <line x1="6" y1="0" x2="16" y2="0" stroke="var(--hud)" strokeWidth="1.4" />
        <line x1="0" y1="-16" x2="0" y2="-6" stroke="var(--hud)" strokeWidth="1.4" />
        <line x1="0" y1="6" x2="0" y2="16" stroke="var(--hud)" strokeWidth="1.4" />
      </g>

      {/* link 1 — shoulder to elbow */}
      <g ref={link1Ref} transform={`rotate(-115 ${BX} ${BY})`}>
        <line
          x1={BX}
          y1={BY}
          x2={BX + L1}
          y2={BY}
          stroke="var(--fog)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <line
          x1={BX}
          y1={BY}
          x2={BX + L1}
          y2={BY}
          stroke="var(--carbon)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* lightening holes, like skeletonized aluminum */}
        <circle cx={BX + 62} cy={BY} r="4.5" fill="none" stroke="var(--fog)" strokeWidth="1.6" />
        <circle cx={BX + 100} cy={BY} r="4.5" fill="none" stroke="var(--fog)" strokeWidth="1.6" />
        <circle cx={BX + 138} cy={BY} r="4.5" fill="none" stroke="var(--fog)" strokeWidth="1.6" />
      </g>

      {/* link 2 — elbow to gripper, drawn in local coords */}
      <g ref={link2Ref} transform={`translate(${BX} ${BY - L1}) rotate(-30)`}>
        <line x1="0" y1="0" x2={L2} y2="0" stroke="var(--fog)" strokeWidth="18" strokeLinecap="round" />
        <line x1="0" y1="0" x2={L2} y2="0" stroke="var(--carbon)" strokeWidth="11" strokeLinecap="round" />
        <circle cx="58" cy="0" r="3.8" fill="none" stroke="var(--fog)" strokeWidth="1.5" />
        <circle cx="92" cy="0" r="3.8" fill="none" stroke="var(--fog)" strokeWidth="1.5" />
        {/* elbow joint */}
        <circle r="14" fill="var(--panel)" stroke="var(--fog)" strokeWidth="2.5" />
        <circle r="6" fill="var(--amber)" />
        {/* wrist + gripper */}
        <circle cx={L2} r="11" fill="var(--panel)" stroke="var(--fog)" strokeWidth="2.5" />
        <circle cx={L2} r="4.5" fill="var(--amber)" />
        <path
          d={`M ${L2 + 12} -11 h 20 v 7`}
          fill="none"
          stroke="var(--fog)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${L2 + 12} 11 h 20 v -7`}
          fill="none"
          stroke="var(--fog)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* shoulder joint cap */}
      <circle cx={BX} cy={BY} r="18" fill="var(--panel)" stroke="var(--fog)" strokeWidth="2.5" />
      <circle cx={BX} cy={BY} r="8" fill="var(--amber)" />

      {/* telemetry panel */}
      <g className="font-mono">
        <rect
          x="8"
          y="8"
          width="168"
          height="104"
          fill="var(--panel)"
          stroke="var(--line-strong)"
          strokeWidth="1"
        />
        <text x="20" y="30" fontSize="9.5" fill="var(--mist)" letterSpacing="1.5">
          GU-ARM-01 / 2-DOF
        </text>
        <text ref={j1Ref} x="20" y="50" fontSize="11.5" fill="var(--fog)">
          J1 +000.0°
        </text>
        <text ref={j2Ref} x="20" y="66" fontSize="11.5" fill="var(--fog)">
          J2 +000.0°
        </text>
        <text ref={eeRef} x="20" y="82" fontSize="11.5" fill="var(--fog)">
          EE X 000 Z 000
        </text>
        <circle ref={dotRef} cx="24" cy="97" r="3.5" fill="#9ad8b4" />
        <text ref={statusRef} x="34" y="101" fontSize="10.5" fill="var(--mist)" letterSpacing="1">
          PATROL
        </text>
      </g>
    </svg>
  );
}
