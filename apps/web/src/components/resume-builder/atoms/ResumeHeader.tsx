"use client";

import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { PersonalInfo } from "@/redux/features/resumeSlice";

interface ResumeHeaderProps {
    personalInfo: PersonalInfo;
    themeConfig: {
        color: string;
        font: string;
    };
    layout?: "centered" | "left" | "right" | "sidebar";
}

export function ResumeHeader({ personalInfo, themeConfig, layout = "left" }: ResumeHeaderProps) {
    const isCentered = layout === "centered";
    const isRight = layout === "right";

    return (
        <header
            className={cn(
                "pb-6 mb-8 border-b-2",
                isCentered && "text-center",
                isRight && "text-right",
                // Sidebar layout might handle its own container, but header stays standard inside it usually
            )}
            style={{ borderColor: themeConfig.color }}
        >
            <h1
                className={cn("text-4xl font-bold uppercase tracking-wide mb-2")}
                style={{ color: layout === "sidebar" ? "white" : "#0f172a" }}
            >
                {personalInfo.fullName || "Your Name"}
            </h1>
            <h2 className={cn("text-xl font-medium mb-4", themeConfig.font)} style={{ color: themeConfig.color }}>
                {personalInfo.jobTitle || "Professional Title"}
            </h2>

            <div className={cn(
                "flex flex-wrap gap-4 text-sm text-slate-600",
                isCentered && "justify-center",
                isRight && "justify-end",
                layout === "sidebar" && "flex-col text-slate-300"
            )}>
                {personalInfo.email && (
                    <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{personalInfo.email}</span>
                    </div>
                )}
                {personalInfo.phone && (
                    <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        <span>{personalInfo.phone}</span>
                    </div>
                )}
                {personalInfo.location && (
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{personalInfo.location}</span>
                    </div>
                )}
                {personalInfo.linkedin && (
                    <div className="flex items-center gap-1.5">
                        <Linkedin className="w-4 h-4" />
                        <span>{personalInfo.linkedin}</span>
                    </div>
                )}
                {personalInfo.github && (
                    <div className="flex items-center gap-1.5">
                        <Github className="w-4 h-4" />
                        <span>{personalInfo.github}</span>
                    </div>
                )}
                {personalInfo.website && (
                    <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>{personalInfo.website}</span>
                    </div>
                )}
            </div>
        </header>
    );
}
