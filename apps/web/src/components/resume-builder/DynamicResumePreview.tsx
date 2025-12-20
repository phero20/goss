"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ResumeHeader } from "./atoms/ResumeHeader";
import { ResumeSection } from "./atoms/ResumeSection";
import { ResumeItem } from "./atoms/ResumeItem";
import { cn } from "@/lib/utils";
import { User, Briefcase, GraduationCap, Wrench, MapPin, Phone, Mail, Linkedin, Globe, Award } from "lucide-react";

interface DynamicResumePreviewProps {
    overrideConfig?: {
        id?: string;
        color?: string;
        font?: string;
    }
}

export function DynamicResumePreview({ overrideConfig }: DynamicResumePreviewProps) {
    const resumeData = useSelector((state: RootState) => state.resume);
    const { personalInfo, experience, education, skills, summary } = resumeData;

    // Use override config if provided, otherwise fallback to Redux state
    const templateConfig = overrideConfig ? { ...resumeData.templateConfig, ...overrideConfig } : resumeData.templateConfig;

    // Layout Logic (The Engine)
    const isSidebarLayout = templateConfig.id === "sidebar";
    const isCenteredLayout = templateConfig.id === "minimal";
    const isTechnicalLayout = templateConfig.id === "technical";
    const isBoldLayout = templateConfig.id === "bold";

    // Derived styles
    const containerClasses = cn(
        "bg-white text-black font-sans min-h-[29.7cm] w-[21cm] mx-auto shadow-2xl print:shadow-none print:w-full print:max-w-none print:min-h-0 print:mx-0 print:p-0",
        isSidebarLayout ? "grid grid-cols-[30%_70%] min-h-[29.7cm]" : "p-12",
        templateConfig.font
    );

    // Sidebar Layout Rendering
    if (isSidebarLayout) {
        return (
            <div id="resume-preview" className={containerClasses}>
                {/* Sidebar (Left) */}
                <div className="bg-slate-900 text-white p-8 space-y-8 h-full min-h-[inherit]" style={{ backgroundColor: templateConfig.color }}>
                    <div className="text-center">
                        {personalInfo.photoUrl && (
                            <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white/20" />
                        )}
                        <h1 className="text-2xl font-bold uppercase tracking-wide mb-2 text-white">
                            {personalInfo.fullName}
                        </h1>
                        <p className="text-white/80 font-medium mb-6">
                            {personalInfo.jobTitle}
                        </p>
                    </div>

                    {/* Contact Info in Sidebar */}
                    {/* Contact Info in Sidebar */}
                    <div className="space-y-4 text-sm text-white/80">
                        {personalInfo.email && (
                            <div className="flex items-center gap-2 break-all">
                                <Mail className="w-4 h-4 shrink-0 opacity-70" />
                                {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 shrink-0 opacity-70" />
                                {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 shrink-0 opacity-70" />
                                {personalInfo.location}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2 break-all">
                                <Linkedin className="w-4 h-4 shrink-0 opacity-70" />
                                {personalInfo.linkedin}
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2 break-all">
                                <Globe className="w-4 h-4 shrink-0 opacity-70" />
                                {personalInfo.website}
                            </div>
                        )}
                    </div>

                    {/* Skills in Sidebar */}
                    {skills.length > 0 && (
                        <div className="pt-6 border-t border-white/20">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
                                <Wrench className="w-3 h-3" /> Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <span key={skill.id} className="bg-white/10 px-2 py-1 rounded text-xs text-white">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content (Right) */}
                <div className="p-8 md:p-12 bg-white h-full min-h-[inherit]">
                    {summary && (
                        <ResumeSection title="Profile" themeConfig={templateConfig} icon={User}>
                            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
                        </ResumeSection>
                    )}

                    {experience.length > 0 && (
                        <ResumeSection title="Experience" themeConfig={templateConfig} icon={Briefcase}>
                            {experience.map(job => (
                                <ResumeItem
                                    key={job.id}
                                    title={job.jobTitle}
                                    subtitle={job.company}
                                    date={`${job.startDate} – ${job.endDate}`}
                                    location={job.location}
                                    description={job.description}
                                    themeConfig={templateConfig}
                                />
                            ))}
                        </ResumeSection>
                    )}

                    {education.length > 0 && (
                        <ResumeSection title="Education" themeConfig={templateConfig} icon={GraduationCap}>
                            {education.map(edu => (
                                <ResumeItem
                                    key={edu.id}
                                    title={edu.school}
                                    subtitle={edu.degree}
                                    date={`${edu.startDate} – ${edu.endDate}`}
                                    location={edu.location}
                                    themeConfig={templateConfig}
                                />
                            ))}
                        </ResumeSection>
                    )}
                </div>
            </div>
        );
    }

    // Bold Layout (Header Background)
    if (isBoldLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("p-12", "")}>
                {/* Bold Header */}
                <header className="p-12 pb-16" style={{ backgroundColor: templateConfig.color }}>
                    <div className="text-white">
                        <h1 className="text-5xl font-bold uppercase tracking-tight mb-2">
                            {personalInfo.fullName || "Your Name"}
                        </h1>
                        <h2 className="text-2xl font-medium text-white/90 mb-6">
                            {personalInfo.jobTitle || "Professional Title"}
                        </h2>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 font-medium">
                            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
                            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
                            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
                            {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
                        </div>
                    </div>
                </header>

                <div className="p-12 -mt-8 bg-white rounded-t-xl mx-4 min-h-[inherit]">
                    {summary && (
                        <section className="mb-10">
                            <p className="text-base text-slate-700 leading-relaxed font-medium">
                                {summary}
                            </p>
                        </section>
                    )}

                    <div className="space-y-2">
                        {experience.length > 0 && (
                            <ResumeSection title="Work Experience" themeConfig={templateConfig} variant="boxed" icon={Briefcase}>
                                {experience.map(job => (
                                    <ResumeItem
                                        key={job.id}
                                        title={job.jobTitle}
                                        subtitle={job.company}
                                        date={`${job.startDate} – ${job.endDate}`}
                                        location={job.location}
                                        description={job.description}
                                        themeConfig={templateConfig}
                                    />
                                ))}
                            </ResumeSection>
                        )}
                        {/* Skills and Education in simplified grid for Bold layout */}
                        <div className="grid grid-cols-2 gap-8">
                            {education.length > 0 && (
                                <ResumeSection title="Education" themeConfig={templateConfig} variant="boxed" icon={GraduationCap}>
                                    {education.map(edu => (
                                        <ResumeItem
                                            key={edu.id}
                                            title={edu.school}
                                            subtitle={edu.degree}
                                            date={`${edu.startDate} – ${edu.endDate}`}
                                            location={edu.location}
                                            themeConfig={templateConfig}
                                        />
                                    ))}
                                </ResumeSection>
                            )}
                            {skills.length > 0 && (
                                <ResumeSection title="Expertise" themeConfig={templateConfig} variant="boxed" icon={Wrench}>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="bg-white border border-slate-200 px-3 py-1 rounded text-sm font-medium text-slate-700"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </ResumeSection>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Technical Layout (2-Column Body)
    if (isTechnicalLayout) {
        return (
            <div id="resume-preview" className={containerClasses}>
                <ResumeHeader
                    personalInfo={personalInfo}
                    themeConfig={templateConfig}
                    layout="left"
                />

                <div className="grid grid-cols-[2fr_1fr] gap-8">
                    {/* Main Column */}
                    <div>
                        {summary && (
                            <section className="mb-8 border-b border-slate-200 pb-6">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    Profile
                                </h3>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {summary}
                                </p>
                            </section>
                        )}

                        {experience.length > 0 && (
                            <ResumeSection title="Professional Experience" themeConfig={templateConfig} variant="minimal" icon={Briefcase}>
                                {experience.map(job => (
                                    <ResumeItem
                                        key={job.id}
                                        title={job.jobTitle}
                                        subtitle={job.company}
                                        date={`${job.startDate} – ${job.endDate}`}
                                        location={job.location}
                                        description={job.description}
                                        themeConfig={templateConfig}
                                    />
                                ))}
                            </ResumeSection>
                        )}
                    </div>

                    {/* Side Column */}
                    <div className="space-y-8">
                        {skills.length > 0 && (
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-slate-900 pb-1">
                                    <Wrench className="w-4 h-4" /> Skills
                                </h3>
                                <div className="space-y-2">
                                    {skills.map((skill) => (
                                        <div key={skill.id} className="text-sm">
                                            <span className="font-semibold text-slate-800 block">{skill.name}</span>
                                            <span className="text-slate-500 text-xs">{skill.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-slate-900 pb-1">
                                    <GraduationCap className="w-4 h-4" /> Education
                                </h3>
                                {education.map(edu => (
                                    <div key={edu.id} className="mb-4">
                                        <div className="font-bold text-slate-800 text-sm">{edu.school}</div>
                                        <div className="text-slate-600 text-sm mb-1">{edu.degree}</div>
                                        <div className="text-slate-400 text-xs italic">{edu.endDate}</div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Standard / Minimal Layout Rendering (Fallback)
    return (
        <div id="resume-preview" className={containerClasses}>
            <ResumeHeader
                personalInfo={personalInfo}
                themeConfig={templateConfig}
                layout={isCenteredLayout ? "centered" : "left"}
            />

            {summary && (
                <section className="mb-8">
                    <p className={cn(
                        "text-sm text-slate-700 leading-relaxed",
                        isCenteredLayout && "text-center max-w-2xl mx-auto italic"
                    )}>
                        {summary}
                    </p>
                </section>
            )}

            <div className="space-y-2">
                {experience.length > 0 && (
                    <ResumeSection title="Experience" themeConfig={templateConfig} variant={isCenteredLayout ? "minimal" : "default"} icon={Briefcase}>
                        {experience.map(job => (
                            <ResumeItem
                                key={job.id}
                                title={job.jobTitle}
                                subtitle={job.company}
                                date={`${job.startDate} – ${job.endDate}`}
                                location={job.location}
                                description={job.description}
                                themeConfig={templateConfig}
                            />
                        ))}
                    </ResumeSection>
                )}

                {education.length > 0 && (
                    <ResumeSection title="Education" themeConfig={templateConfig} variant={isCenteredLayout ? "minimal" : "default"} icon={GraduationCap}>
                        {education.map(edu => (
                            <ResumeItem
                                key={edu.id}
                                title={edu.school}
                                subtitle={edu.degree}
                                date={`${edu.startDate} – ${edu.endDate}`}
                                location={edu.location}
                                themeConfig={templateConfig}
                            />
                        ))}
                    </ResumeSection>
                )}

                {skills.length > 0 && (
                    <ResumeSection title="Skills" themeConfig={templateConfig} variant={isCenteredLayout ? "minimal" : "default"} icon={Wrench}>
                        <div className={cn("flex flex-wrap gap-2", isCenteredLayout && "justify-center")}>
                            {skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className={cn(
                                        "px-3 py-1 rounded text-sm font-medium",
                                        isCenteredLayout ? "border border-slate-200 bg-white" : "bg-slate-100 text-slate-800"
                                    )}
                                >
                                    {skill.name} <span className="text-slate-400 font-normal">| {skill.level}</span>
                                </span>
                            ))}
                        </div>
                    </ResumeSection>
                )}
            </div>
        </div>
    );
}
