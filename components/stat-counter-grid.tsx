import React from "react";
import { site } from "@/content/site.config";
import { leadTeacherAverageTenure } from "@/content/staff";

export function StatCounterGrid() {
  const stats = [
    {
      stat: "1:3",
      label: "Infant Ratio",
      subtext: "Illinois minimum is 1:4",
      highlight: true,
    },
    {
      stat: "Gold",
      label: "ExceleRate Illinois",
      subtext: "Highest quality designation",
      highlight: false,
    },
    {
      stat: `${leadTeacherAverageTenure} Yrs`,
      label: "Avg Teacher Tenure",
      subtext: "Experienced, stable care",
      highlight: false,
    },
    {
      stat: "100%",
      label: "CPR & First Aid",
      subtext: "All lead staff certified",
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-[12px] border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-[2.25rem] font-bold leading-none text-brand lg:text-[2.75rem]">
              {item.stat}
            </span>
            {item.highlight && (
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            )}
          </div>
          <p className="mt-3 font-serif text-[1.0625rem] font-semibold text-ink leading-tight">
            {item.label}
          </p>
          <p className="mt-1 text-[0.875rem] text-muted leading-snug">
            {item.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
