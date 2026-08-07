"use client";

import { useState } from "react";

export default function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-cream"
      >
        <span className="relative block h-[11px] w-[16px]">
          <span
            className={`absolute left-0 top-0 block h-[1.5px] w-full bg-cream transition-transform duration-200 ${
              open ? "translate-y-[4.75px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 block h-[1.5px] w-full bg-cream transition-transform duration-200 ${
              open ? "-translate-y-[4.75px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-forest/95 px-5 py-6 backdrop-blur-md">
          <ul className="space-y-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-lg font-semibold text-cream/85 transition-colors hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-pill mt-6 inline-block bg-cream px-5 py-2.5 text-sm font-bold text-ink"
          >
            Visit the lab
          </a>
        </div>
      )}
    </div>
  );
}
