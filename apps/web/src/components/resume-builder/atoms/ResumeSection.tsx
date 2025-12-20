"use client";

import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react";

interface ResumeSectionProps {
    title: string;
    children: React.ReactNode;
    themeConfig: {
        color: string;
        font: string;
    };
    variant?: "default" | "minimal" | "boxed";
    icon?: LucideIcon;
}

export function ResumeSection({ title, children, themeConfig, variant = "default", icon: Icon }: ResumeSectionProps) {
    return (
        <section className="mb-8 break-inside-avoid">
            <h3
                className={cn(
                    "flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3 pb-1",
                    variant === "default" && "border-b text-slate-500",
                    variant === "minimal" && "text-slate-800",
                    variant === "boxed" && "bg-slate-100 p-2 rounded text-slate-800"
                )}
                style={{
                    borderColor: variant === "default" ? "#e2e8f0" : "transparent",
                    color: variant === "boxed" ? undefined : themeConfig.color
                }}
            >
                {Icon && <Icon className="w-4 h-4" />}
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
}
