import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Film } from "lucide-react";

const LINKS = [
  { to: "/", label: "Characters" },
  { to: "/locations", label: "Locations" },
];

export default function SiteNav({ action, subtitle }) {
  const { pathname } = useLocation();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04]">
          <Film className="h-4 w-4 text-[#E3A75F]" />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">Story Studio</p>
          {subtitle && <p className="text-[11px] text-white/30">{subtitle}</p>}
        </div>
      </div>

      <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {LINKS.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-1.5 text-[12.5px] transition ${
                active
                  ? "bg-[#E3A75F] font-medium text-[#14100A]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center">{action}</div>
    </header>
  );
}