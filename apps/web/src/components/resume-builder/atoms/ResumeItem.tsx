"use client";

import { cn } from "@/lib/utils";

interface ResumeItemProps {
    title: string;
    subtitle: string;
    date: string;
    location?: string;
    description?: string;
    themeConfig: {
        color: string;
        font: string;
    };
}

export function ResumeItem({ title, subtitle, date, location, description, themeConfig }: ResumeItemProps) {
    return (
        <div className="break-inside-avoid">
            <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-slate-900 leading-tight">{title}</h4>
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap ml-4">
                    {date}
                </span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 font-medium text-sm" style={{ color: themeConfig.color }}>
                    {subtitle}
                </span>
                {location && (
                    <span className="text-xs text-slate-500">{location}</span>
                )}
            </div>
            {description && (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                    {description}
                </p>
            )}
        </div>
    );
}
