import Image from "next/image";
import Link from "next/link";
import LabCard, { type LabData } from "@/components/LabCard";
import MobileNav from "@/components/MobileNav";
import {
  CountUp,
  FadeUp,
  Parallax,
  ProgressRail,
  WordReveal,
} from "@/components/anim";

const UNIVERSITY_URL = "https://www.galgotiasuniversity.edu.in";

const NAV_LINKS = [
  { href: "#mission", label: "Mission" },
  { href: "#stack", label: "The stack" },
  { href: "#labs", label: "The labs" },
  { href: "#ecosystem", label: "Ecosystem" },
];

function ArrowPill({
  href,
  children,
  variant = "cream",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "cream" | "ink" | "ghost-dark" | "ghost-light";
}) {
  const styles = {
    cream: "bg-cream text-ink",
    ink: "bg-ink text-ivory",
    "ghost-dark": "border border-line-strong text-cream",
    "ghost-light": "border border-hairline text-ink",
  } as const;
  const chip = {
    cream: "bg-forest text-cream",
    ink: "bg-ivory/20 text-ivory",
    "ghost-dark": "bg-cream/15 text-cream",
    "ghost-light": "bg-ink/10 text-ink",
  } as const;
  return (
    <a
      href={href}
      className={`btn-pill group inline-flex items-center gap-3 py-2 pl-6 pr-2 font-display text-[15px] font-semibold ${styles[variant]}`}
    >
      {children}
      <span
        aria-hidden
        className={`grid h-8 w-8 place-items-center rounded-full text-sm transition-transform duration-200 group-hover:translate-x-0.5 ${chip[variant]}`}
      >
        →
      </span>
    </a>
  );
}

function Eyebrow({
  children,
  dark = false,
  center = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-[11px] tracking-[0.28em] uppercase ${
        center ? "justify-center" : ""
      } ${dark ? "text-cream/60" : "text-sage"}`}
    >
      <span
        aria-hidden
        className={`block h-1.5 w-1.5 ${dark ? "bg-cream" : "bg-ink"}`}
      />
      {children}
    </p>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-forest/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-4">
          <Image
            src="/galgotias-logo.png"
            alt="Galgotias University"
            width={450}
            height={90}
            priority
            className="h-8 w-auto shrink-0 sm:h-10"
          />
          <span aria-hidden className="hidden h-8 w-px bg-cream/20 lg:block" />
          <span className="hidden font-mono text-[10px] leading-relaxed tracking-[0.24em] text-cream/70 uppercase lg:block">
            Physical AI &amp;
            <br />
            Robotics Lab
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-cream/70 transition-colors hover:text-cream"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="btn-pill hidden bg-cream px-5 py-2.5 font-display text-sm font-bold text-ink sm:inline-block"
          >
            Visit the lab
          </a>
          <MobileNav links={NAV_LINKS} />
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-2.5 pt-[78px] sm:px-4 sm:pt-[86px]">
      <div className="dot-grid relative overflow-hidden rounded-[24px] bg-forest text-cream sm:rounded-[28px]">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        {/* exploded humanoid blueprint */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Parallax from={18} to={-18} className="h-full w-full">
            <Image
              src="/humanoid-diagram.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-diagram-mask scale-[1.08] object-cover object-center opacity-45"
            />
          </Parallax>
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-end px-5 pb-12 pt-32 sm:px-10 sm:pt-40 lg:min-h-[82vh] lg:pb-16 lg:pt-52">
          <FadeUp>
            <Eyebrow dark>Galgotias University · Greater Noida, India</Eyebrow>
          </FadeUp>
          <h1 className="mt-6 max-w-3xl font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]">
            <WordReveal text="Building the Next Generation of Physical AI Engineers" />
          </h1>
          <FadeUp delay={0.5}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75 sm:text-xl">
              Don&apos;t just program robots.{" "}
              <span className="font-display font-bold text-cream">
                Build them.
              </span>
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ArrowPill href="#labs" variant="cream">
                Explore the labs
              </ArrowPill>
              <ArrowPill href="#mission" variant="ghost-dark">
                Read the mission
              </ArrowPill>
            </div>
          </FadeUp>
          <p className="absolute bottom-6 right-8 hidden font-mono text-[11px] tracking-[0.18em] text-cream/45 uppercase md:block">
            FIG. 01 — Open-source humanoid · exploded view
          </p>
        </div>
      </div>
    </section>
  );
}

const PLATFORMS = [
  "NVIDIA DGX H200",
  "OpenArm 14-DOF",
  "Open-Source Humanoids",
  "Quadruped",
  "Autonomous Mobile Robots",
  "UGV",
  "Dexterous Hand",
  "Harmonic Reducers",
];

function PlatformTicker() {
  const strip = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {PLATFORMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-8 font-display text-lg font-semibold text-sage/80">
            {item}
          </span>
          <span aria-hidden className="block h-1 w-1 rounded-full bg-ink/40" />
        </span>
      ))}
    </span>
  );
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
        <Eyebrow center>The platforms on our floor</Eyebrow>
        <div className="marquee marquee-fade mt-7">
          <div className="marquee-track">
            {strip(false)}
            {strip(true)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-32">
        <FadeUp className="text-center">
          <Eyebrow center>01 — The Mission</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text="Innovators, not users of technology." />
          </h2>
        </FadeUp>
        <div className="mx-auto mt-14 grid max-w-5xl gap-10 text-lg leading-relaxed text-sage lg:grid-cols-2">
          <FadeUp delay={0.1}>
            <p>
              At Galgotias University, we are making one of the country&apos;s
              most significant institutional commitments to Physical AI
              education and research. Rather than relying on off-the-shelf
              robotic platforms and teaching students to use APIs and SDKs, we
              have invested extensively in{" "}
              <strong className="font-semibold text-ink">
                building an open-source Physical AI ecosystem from the ground
                up.
              </strong>
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p>
              Our laboratories enable students to design custom hardware,
              develop actuators, build embedded electronics, integrate sensors,
              implement AI perception, and engineer complete robotic systems
              from first principles — equipping them to understand every layer
              of intelligent machines, and{" "}
              <strong className="font-semibold text-ink">
                empowering them to become innovators, not just users of
                technology.
              </strong>
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function QuoteCanvas() {
  return (
    <section className="px-2.5 sm:px-4">
      <div className="dot-grid relative overflow-hidden rounded-[24px] bg-forest text-cream sm:rounded-[28px]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-10 lg:py-28">
          <FadeUp>
            <Eyebrow dark>The Commitment</Eyebrow>
          </FadeUp>
          <blockquote className="mt-10 max-w-4xl border-l-2 border-cream/60 pl-5 font-display text-2xl font-bold leading-[1.15] tracking-[-0.02em] sm:pl-10 sm:text-4xl lg:text-[2.9rem]">
            <WordReveal text="“Every layer of the machine — from hardware to autonomy — built by student hands, from first principles.”" />
          </blockquote>
          <FadeUp delay={0.4}>
            <p className="mt-10 pl-5 font-mono text-xs tracking-[0.24em] text-cream/60 uppercase sm:pl-10">
              Physical AI &amp; Robotics Lab — Galgotias University
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Flagship compute",
            value: <CountUp to={1000000} prefix="$" />,
            detail: "NVIDIA DGX H200",
          },
          {
            label: "Dedicated labs",
            value: <CountUp to={7} pad={2} />,
            detail: "and counting",
          },
          {
            label: "Hardware on the floor",
            value: <CountUp to={1.07} prefix="$" suffix="M+" decimals={2} />,
            detail: "open source",
          },
          {
            label: "Supporting ecosystem",
            value: <span>$4–6B</span>,
            detail: "USD",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`px-5 py-8 sm:px-8 sm:py-10 ${i % 2 === 1 ? "border-l border-hairline" : ""} ${
              i >= 2 ? "border-t border-hairline lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l" : ""}`}
          >
            <span aria-hidden className="mb-5 block h-0.5 w-7 bg-ink" />
            <p className="font-mono text-[10px] tracking-[0.24em] text-sage uppercase">
              {s.label}
            </p>
            <p className="mt-3 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1.5 text-sm text-sage">{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STACK = [
  {
    level: "L05",
    title: "Autonomy & learning",
    desc: "Behavior, planning and learned control — policies trained in simulation, then deployed on real machines.",
  },
  {
    level: "L04",
    title: "AI perception",
    desc: "Cameras, depth and IMUs fused into world models — detection, tracking and SLAM running at the edge.",
  },
  {
    level: "L03",
    title: "Compute",
    desc: "From the DGX H200 training cluster down to the embedded inference boards riding on every robot.",
  },
  {
    level: "L02",
    title: "Electronics & sensors",
    desc: "Custom PCBs, motor drivers, CAN buses and power systems — the nervous system of the machine.",
  },
  {
    level: "L01",
    title: "Actuation",
    desc: "Motors, harmonic reducers and transmissions — characterized, tuned and rebuilt by student hands.",
  },
  {
    level: "L00",
    title: "Mechanical structure",
    desc: "CAD, 3D printing and machining — the skeleton every other layer bolts onto.",
  },
];

function Stack() {
  return (
    <section id="stack" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-32">
        <FadeUp className="text-center">
          <Eyebrow center>02 — Full Stack</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text="Every layer of the machine." />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sage">
            Most programs teach the top of the stack and buy the rest. Here,
            students own all six layers.
          </p>
        </FadeUp>
        <ProgressRail className="mx-auto mt-16 max-w-4xl pl-6 sm:pl-12">
          {STACK.map((layer, i) => (
            <FadeUp key={layer.level} delay={i * 0.06}>
              <div className="group grid gap-2 border-b border-hairline py-7 pr-4 transition-colors duration-300 hover:bg-white sm:grid-cols-[90px_240px_1fr] sm:gap-6 sm:rounded-r-xl sm:pl-4">
                <span className="font-mono text-sm text-ink/50">
                  {layer.level}
                </span>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  {layer.title}
                </h3>
                <p className="leading-relaxed text-sage">{layer.desc}</p>
              </div>
            </FadeUp>
          ))}
          <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-sage/70 uppercase">
            Order = depth. L00 carries everything above it.
          </p>
        </ProgressRail>
      </div>
    </section>
  );
}

const LABS: LabData[] = [
  {
    id: "LAB 02",
    name: "AMR Lab",
    glyph: "amr",
    items: [
      {
        name: "Autonomous Mobile Robot",
        note: "Indoor navigation, mapping and fleet autonomy",
        value: "$8,000",
        status: "floor",
      },
    ],
  },
  {
    id: "LAB 03",
    name: "UGV Lab",
    glyph: "ugv",
    items: [
      {
        name: "Unmanned Ground Vehicle",
        note: "Outdoor platform for field robotics on real terrain",
        value: "$3,000",
        status: "floor",
      },
    ],
  },
  {
    id: "LAB 04",
    name: "Robotic Arm Lab",
    glyph: "arm",
    items: [
      {
        name: "Robotic Arm — 6 DOF",
        note: "Manipulation research — teach & replay to learned policies",
        value: "$1,000",
        status: "floor",
      },
      {
        name: "OpenArm — 14 DOF",
        note: "Open-source bimanual manipulation platform",
        value: "$6,000",
        status: "floor",
      },
    ],
  },
  {
    id: "LAB 05",
    name: "Humanoid Lab",
    glyph: "humanoid",
    items: [
      {
        name: "Open-Source Humanoid — Miniature",
        note: "Gait and balance research at desk scale",
        value: "$2,500",
        status: "floor",
      },
      {
        name: "Open-Source Humanoid — Gen 2",
        note: "Full-scale humanoid research platform",
        value: "$15,000",
        status: "floor",
      },
      {
        name: "Open-Source Humanoid — Gen 3",
        note: "Next-generation build, specification in progress",
        value: "TBD",
        status: "planning",
      },
      {
        name: "Harmonic Reducers",
        note: "Precision transmissions for humanoid joints",
        value: "$8,000",
        status: "floor",
      },
      {
        name: "Actuator Inventory",
        note: "High-torque actuators for the next builds",
        value: "≈$8,000",
        status: "order",
      },
    ],
  },
  {
    id: "LAB 06",
    name: "Quadruped Lab",
    glyph: "quadruped",
    items: [
      {
        name: "Open-Source Quadruped",
        note: "Legged locomotion over unstructured terrain",
        value: "$15,000",
        status: "order",
      },
    ],
  },
  {
    id: "LAB 07",
    name: "Dexterous Hand Lab",
    glyph: "hand",
    items: [
      {
        name: "Open-Source Programmable Hand",
        note: "Fine manipulation and grasping research",
        value: "$4,000",
        status: "order",
      },
    ],
  },
];

function Labs() {
  return (
    <section id="labs" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-32">
        <FadeUp className="text-center">
          <Eyebrow center>03 — Bill of Materials</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text="Seven labs. One pipeline." />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sage">
            Every platform on the floor is open source — built to be opened,
            broken, understood and rebuilt.
          </p>
        </FadeUp>

        {/* flagship canvas */}
        <FadeUp className="mt-16">
          <div className="dot-grid relative overflow-hidden rounded-[24px] bg-forest text-cream sm:rounded-[28px]">
            <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative grid items-center gap-12 px-5 py-10 sm:px-10 lg:grid-cols-[11fr_9fr] lg:py-14">
              <div>
                <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.24em] text-cream/60 uppercase">
                  <span aria-hidden className="block h-1.5 w-1.5 bg-cream" />
                  LAB 01 — NVIDIA Lab
                </p>
                <h3 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
                  NVIDIA DGX H200
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-cream/70">
                  Foundation-model training and large-scale reinforcement
                  learning — the compute backbone of every lab on this page.
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {["8× NVIDIA H200", "1,128 GB HBM3e", "32 petaFLOPS FP8"].map(
                    (spec) => (
                      <span
                        key={spec}
                        className="rounded-full border border-cream/25 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-cream/80"
                      >
                        {spec}
                      </span>
                    ),
                  )}
                </div>
                <div className="mt-10">
                  <CountUp
                    to={1000000}
                    prefix="$"
                    className="font-display text-5xl font-extrabold tracking-[-0.02em] text-cream sm:text-6xl"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <p className="font-mono text-[11px] tracking-[0.2em] text-cream/50 uppercase">
                      Single-system investment
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-forest uppercase">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-forest" />
                      On the floor
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Parallax from={14} to={-14}>
                  <Image
                    src="/hgx-h200.png"
                    alt="NVIDIA HGX H200 8-GPU baseboard"
                    width={484}
                    height={495}
                    className="h-auto w-full max-w-[280px] drop-shadow-[0_28px_56px_rgba(0,0,0,0.5)] sm:max-w-[380px]"
                  />
                </Parallax>
              </div>
            </div>
            <p className="pointer-events-none absolute bottom-5 right-8 hidden font-mono text-[10px] tracking-[0.18em] text-cream/40 uppercase lg:block">
              FIG. 02 — HGX H200 8-GPU baseboard
            </p>
          </div>
        </FadeUp>

        {/* lab cards */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {LABS.map((lab, i) => (
            <FadeUp key={lab.id} delay={Math.min(i * 0.07, 0.35)} className="h-full">
              <LabCard lab={lab} />
            </FadeUp>
          ))}
        </div>
        <FadeUp>
          <p className="mt-10 text-center font-mono text-[11px] tracking-[0.2em] text-sage/70 uppercase">
            Visible hardware ≈ $1.07M and growing · every platform open source
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function Ecosystem() {
  return (
    <section id="ecosystem" className="scroll-mt-24 border-y border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <FadeUp>
          <Eyebrow center>04 — Beyond the Lab</Eyebrow>
          <p className="mt-10 font-display text-6xl font-black tracking-[-0.04em] text-ink sm:text-[7.5rem] sm:leading-none">
            $4–6B
          </p>
          <h2 className="mx-auto mt-8 max-w-2xl font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            Billions of dollars of ecosystem behind every build.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-sage">
            The lab doesn&apos;t stand alone. It operates inside $4–6 billion
            USD of supporting ecosystem — university infrastructure, industry
            partnerships and initiatives that students plug into directly.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 px-2.5 py-14 sm:px-4 lg:py-20">
      <div className="dot-grid relative overflow-hidden rounded-[24px] bg-forest text-cream sm:rounded-[28px]">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-10 lg:py-28">
          <FadeUp>
            <Eyebrow dark center>
              05 — Visit Us
            </Eyebrow>
          </FadeUp>
          <h2 className="mx-auto mt-8 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="The future of Physical AI starts on this floor." />
          </h2>
          <FadeUp delay={0.4}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/70">
              Prospective students, researchers and partners — the floor is
              open. Come see the machines, meet the build teams, and find your
              bench.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <ArrowPill href={UNIVERSITY_URL} variant="cream">
                Galgotias University
              </ArrowPill>
              <ArrowPill href="#labs" variant="ghost-dark">
                Back to the labs
              </ArrowPill>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-4 overflow-hidden bg-forest text-cream">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/galgotias-logo.png"
              alt="Galgotias University"
              width={450}
              height={90}
              className="h-10 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/60">
              The Physical AI &amp; Robotics Lab — an open-source ecosystem
              where students engineer intelligent machines from first
              principles. Every layer, from actuation to autonomy.
            </p>
          </div>
          <nav aria-label="site" className="text-sm">
            <p className="font-mono text-[10px] tracking-[0.24em] text-cream/40 uppercase">
              Sections
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-cream/70 transition-colors hover:text-cream"
                  >
                    {`0${i + 1} — ${l.label}`}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="elsewhere" className="text-sm">
            <p className="font-mono text-[10px] tracking-[0.24em] text-cream/40 uppercase">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={UNIVERSITY_URL} className="text-cream/70 transition-colors hover:text-cream">
                  Galgotias University
                </a>
              </li>
              <li>
                <a href="https://gbuildspace.vercel.app/" className="text-cream/70 transition-colors hover:text-cream">
                  Galgotias Buildspace
                </a>
              </li>
              <li><a href="#" className="text-cream/70 transition-colors hover:text-cream">X / Twitter</a></li>
              <li><a href="#" className="text-cream/70 transition-colors hover:text-cream">GitHub</a></li>
            </ul>
          </nav>
          <div className="text-sm">
            <p className="font-mono text-[10px] tracking-[0.24em] text-cream/40 uppercase">
              The Lab
            </p>
            <p className="mt-4 leading-relaxed text-cream/70">
              Galgotias University
              <br />
              Plot No. 2, Yamuna Expressway
              <br />
              Greater Noida, Uttar Pradesh, India
            </p>
            <a
              href="#contact"
              className="btn-pill mt-6 inline-block bg-cream px-5 py-2.5 font-display text-sm font-bold text-ink"
            >
              Visit the lab
            </a>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-16 select-none whitespace-nowrap font-display text-[13.5vw] font-black leading-[0.78] tracking-[-0.04em] text-cream/[0.05]"
        >
          PHYSICAL AI
        </p>

        <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[11px] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Physical AI &amp; Robotics Lab — Galgotias University</p>
          <p>
            Engineered on campus, from first principles ·{" "}
            <span className="text-cream/70">E-STOP: nearest red button</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#mission"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <PlatformTicker />
        <Mission />
        <QuoteCanvas />
        <Stats />
        <Stack />
        <Labs />
        <Ecosystem />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
