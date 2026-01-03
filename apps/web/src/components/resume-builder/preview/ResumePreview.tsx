"use client";

import { useRef, useState, useEffect, forwardRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
    const resumeData = useSelector((state: RootState) => state.resume);
    const { personalInfo, experience, education, skills, summary } = resumeData;
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Auto-scale logic to fit A4 width into container
    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // A4 Width at 96 DPI is 794px
                const a4Width = 794;
                // We desire some padding on sides (e.g. 24px total)
                const availableWidth = containerWidth - 48;

                let newScale = availableWidth / a4Width;

                // Cap scale at 1.1 (slight zoom allowed) but usually 1 is max
                if (newScale > 1.2) newScale = 1.2;

                // Allow it to go small for mobile
                if (newScale < 0.3) newScale = 0.3;

                setScale(newScale);
            }
        };

        // Initial calc
        calculateScale();

        // Add listener
        const resizeObserver = new ResizeObserver(() => {
            calculateScale();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener("resize", calculateScale);

        return () => {
            window.removeEventListener("resize", calculateScale);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-zinc-100/50">
            <style type="text/css" media="print">
                {`
                    @page { size: A4; margin: 0; }
                    body { margin: 0; padding: 0; }
                `}
            </style>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col items-center print:overflow-visible" ref={containerRef}>
                <div
                    className="my-8 origin-top transition-transform duration-100 ease-out will-change-transform print:hidden"
                    style={{
                        transform: `scale(${scale})`,
                        width: "794px",
                        minHeight: "1123px",
                        marginBottom: `-${(1 - scale) * 1123}px`
                    }}
                >
                    {/* Preview-only wrapper to handle scaling. */}
                    <div
                        ref={ref}
                        className="bg-white text-black shadow-2xl w-full flex flex-col print:shadow-none print:w-[210mm] print:h-[297mm] print:overflow-visible"
                        style={{ minHeight: "1123px" }}
                    >
                        <div className="p-[40px] flex-1 flex flex-col gap-6 print:p-[15mm]">

                            {/* Header */}
                            <header className="border-b-2 border-zinc-900 pb-6">
                                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2 text-zinc-900">
                                    {personalInfo.fullName || "Your Name"}
                                </h1>
                                <p className="text-xl text-zinc-600 font-medium mb-4">
                                    {personalInfo.jobTitle || "Professional Title"}
                                </p>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 font-medium">
                                    {personalInfo.email && (
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span>{personalInfo.email}</span>
                                        </div>
                                    )}
                                    {personalInfo.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>{personalInfo.phone}</span>
                                        </div>
                                    )}
                                    {personalInfo.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{personalInfo.location}</span>
                                        </div>
                                    )}
                                    {personalInfo.linkedin && (
                                        <div className="flex items-center gap-1.5">
                                            <Linkedin className="w-3.5 h-3.5" />
                                            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                                                LinkedIn
                                            </a>
                                        </div>
                                    )}
                                    {personalInfo.github && (
                                        <div className="flex items-center gap-1.5">
                                            <Github className="w-3.5 h-3.5" />
                                            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                                                GitHub
                                            </a>
                                        </div>
                                    )}
                                    {personalInfo.website && (
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5" />
                                            <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                                                Portfolio
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </header>

                            {/* Summary */}
                            {summary && (
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                                        <span className="w-full h-px bg-zinc-200"></span>
                                        Professional Summary
                                        <span className="w-full h-px bg-zinc-200"></span>
                                    </h3>
                                    <p className="text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap text-justify">
                                        {summary}
                                    </p>
                                </section>
                            )}

                            {/* Experience */}
                            {experience.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                                        <span className="w-full h-px bg-zinc-200"></span>
                                        Experience
                                        <span className="w-full h-px bg-zinc-200"></span>
                                    </h3>
                                    <div className="space-y-6">
                                        {experience.map((exp) => (
                                            <div key={exp.id} className="break-inside-avoid">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="font-bold text-lg text-zinc-900">{exp.jobTitle}</h4>
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 whitespace-nowrap bg-zinc-100 px-2 py-1 rounded">
                                                        {exp.startDate} – {exp.endDate || "Present"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-bold text-zinc-700">{exp.company}</span>
                                                    <span className="text-xs text-zinc-500 font-medium">{exp.location}</span>
                                                </div>
                                                {exp.description && (
                                                    <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Education */}
                            {education.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                                        <span className="w-full h-px bg-zinc-200"></span>
                                        Education
                                        <span className="w-full h-px bg-zinc-200"></span>
                                    </h3>
                                    <div className="space-y-4">
                                        {education.map((edu) => (
                                            <div key={edu.id} className="break-inside-avoid">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="font-bold text-base text-zinc-900">{edu.school}</h4>
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 whitespace-nowrap bg-zinc-100 px-2 py-1 rounded">
                                                        {edu.startDate} – {edu.endDate || "Present"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-zinc-800 font-medium">{edu.degree}</span>
                                                    <span className="text-xs text-zinc-500 italic">{edu.location}</span>
                                                </div>
                                                {edu.description && (
                                                    <p className="text-sm mt-1 text-zinc-600">
                                                        {edu.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Skills */}
                            {skills.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                                        <span className="w-full h-px bg-zinc-200"></span>
                                        Skills
                                        <span className="w-full h-px bg-zinc-200"></span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <span key={skill.id} className="px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full shadow-sm">
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

ResumePreview.displayName = "ResumePreview";
