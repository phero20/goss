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

    // Executive Layout (Photo Header + Sidebar Right)
    const isExecutiveLayout = templateConfig.id === "executive";
    if (isExecutiveLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("p-12", "")}>
                {/* Header Bar */}
                <div className="bg-slate-900 text-white p-12 py-16 flex items-center justify-between" style={{ backgroundColor: templateConfig.color }}>
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight">{personalInfo.fullName}</h1>
                        <p className="text-xl opacity-90 font-medium">{personalInfo.jobTitle}</p>

                        <div className="flex flex-wrap gap-4 text-sm opacity-80 pt-4 mt-4 border-t border-white/20">
                            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
                            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
                            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
                        </div>
                    </div>

                    {personalInfo.photoUrl && (
                        <div className="shrink-0 ml-8 border-4 border-white/20 rounded-lg overflow-hidden shadow-lg">
                            <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 object-cover" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-[2fr_1fr] min-h-[inherit]">
                    {/* Main Left Content */}
                    <div className="p-10 space-y-8 bg-white">
                        {summary && (
                            <ResumeSection title="Executive Summary" themeConfig={templateConfig} icon={User}>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">{summary}</p>
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
                    </div>

                    {/* Right Sidebar */}
                    <div className="bg-slate-50 p-8 border-l border-slate-100 space-y-8">
                        {skills.length > 0 && (
                            <ResumeSection title="Core Competencies" themeConfig={templateConfig} icon={Wrench} variant="minimal">
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700 shadow-sm"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </ResumeSection>
                        )}

                        {education.length > 0 && (
                            <ResumeSection title="Education" themeConfig={templateConfig} icon={GraduationCap} variant="minimal">
                                {education.map(edu => (
                                    <div key={edu.id} className="mb-4 text-sm">
                                        <div className="font-bold text-slate-900">{edu.school}</div>
                                        <div className="text-slate-600">{edu.degree}</div>
                                        <div className="text-slate-400 text-xs mt-1">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </ResumeSection>
                        )}

                        <div className="space-y-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                            {personalInfo.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-3.5 h-3.5" />
                                    <span className="truncate">{personalInfo.linkedin}</span>
                                </div>
                            )}
                            {personalInfo.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span className="truncate">{personalInfo.website}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    // Creative Split Layout (Sidebar Left with Large Photo)
    const isCreativeLayout = templateConfig.id === "creative";
    if (isCreativeLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("p-12", "").replace("grid-cols-[30%_70%]", "") + " grid grid-cols-[35%_65%] min-h-[29.7cm]"}>
                {/* Left Sidebar */}
                <div className="text-white p-8 space-y-8 flex flex-col" style={{ backgroundColor: templateConfig.color }}>
                    <div className="space-y-4 text-center">
                        {personalInfo.photoUrl && (
                            <div className="relative w-40 h-40 mx-auto">
                                <span className="absolute inset-0 rounded-full border-4 border-white/30 transform -translate-x-1 -translate-y-1"></span>
                                <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white relative z-10" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-wider">{personalInfo.fullName}</h1>
                            <p className="opacity-90 mt-2 font-medium bg-white/10 py-1 px-3 rounded-full inline-block text-sm">
                                {personalInfo.jobTitle}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/20">
                        {/* Contact */}
                        <div className="space-y-3 text-sm font-medium opacity-90">
                            {personalInfo.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 shrink-0" />{personalInfo.email}</div>}
                            {personalInfo.phone && <div className="flex items-center gap-3"><Phone className="w-4 h-4 shrink-0" />{personalInfo.phone}</div>}
                            {personalInfo.location && <div className="flex items-center gap-3"><MapPin className="w-4 h-4 shrink-0" />{personalInfo.location}</div>}
                            {personalInfo.linkedin && <div className="flex items-center gap-3"><Linkedin className="w-4 h-4 shrink-0" />{personalInfo.linkedin}</div>}
                            {personalInfo.website && <div className="flex items-center gap-3"><Globe className="w-4 h-4 shrink-0" />{personalInfo.website}</div>}
                        </div>

                        {/* Education (Sidebar) */}
                        {education.length > 0 && (
                            <div className="pt-6 border-t border-white/20">
                                <h3 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-70">Education</h3>
                                <div className="space-y-4">
                                    {education.map(edu => (
                                        <div key={edu.id} className="text-sm">
                                            <div className="font-bold">{edu.school}</div>
                                            <div className="opacity-80 text-xs">{edu.degree}</div>
                                            <div className="opacity-60 text-[10px] mt-0.5">{edu.startDate} - {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills (Sidebar) */}
                        {skills.length > 0 && (
                            <div className="pt-6 border-t border-white/20">
                                <h3 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-70">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span key={skill.id} className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content */}
                <div className="p-10 bg-white min-h-[inherit]">
                    {summary && (
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-slate-900 border-b-2 pb-2 mb-4" style={{ borderColor: templateConfig.color }}>Profile</h3>
                            <p className="text-slate-700 leading-relaxed font-medium">{summary}</p>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 border-b-2 pb-2 mb-6" style={{ borderColor: templateConfig.color }}>Work Experience</h3>
                            <div className="space-y-8">
                                {experience.map(job => (
                                    <div key={job.id} className="relative pl-6 border-l-2 border-slate-200">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: templateConfig.color }}></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="text-lg font-bold text-slate-800">{job.jobTitle}</h4>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{job.startDate} – {job.endDate}</span>
                                        </div>
                                        <div className="text-base font-semibold text-slate-600 mb-2">{job.company}, {job.location}</div>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Minimal Photo Layout
    const isMinimalPhotoLayout = templateConfig.id === "minimal-photo";
    if (isMinimalPhotoLayout) {
        return (
            <div id="resume-preview" className={containerClasses}>
                <div className="text-center space-y-6 mb-10">
                    {personalInfo.photoUrl && (
                        <div className="w-32 h-32 mx-auto rounded-full p-1 border border-slate-200 shadow-sm">
                            <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <h1 className="text-4xl font-light tracking-tight text-slate-900">{personalInfo.fullName}</h1>
                        <p className="text-lg text-slate-500 uppercase tracking-widest font-normal">{personalInfo.jobTitle}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
                        {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
                    </div>
                </div>

                {summary && (
                    <div className="mb-8 text-center max-w-2xl mx-auto">
                        <p className="text-slate-600 leading-relaxed">
                            {summary}
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        <div className="h-px bg-slate-200"></div>
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Experience</h3>
                        <div className="h-px bg-slate-200"></div>
                    </div>

                    {experience.length > 0 && (
                        <div className="space-y-6">
                            {experience.map(job => (
                                <div key={job.id} className="grid grid-cols-[150px_1fr] gap-6">
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-800">{job.startDate} - {job.endDate}</div>
                                        <div className="text-xs text-slate-500 mt-1">{job.location}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900">{job.jobTitle}</h4>
                                        <div className="text-sm font-semibold mb-2" style={{ color: templateConfig.color }}>{job.company}</div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center pt-4">
                        <div className="h-px bg-slate-200"></div>
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Education & Skills</h3>
                        <div className="h-px bg-slate-200"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            {education.map(edu => (
                                <div key={edu.id} className="mb-4">
                                    <div className="font-bold text-slate-900">{edu.school}</div>
                                    <div className="text-sm text-slate-600">{edu.degree}</div>
                                    <div className="text-xs text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <span key={skill.id} className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    // Classic Professional Layout (Based on User Image)
    const isClassicLayout = templateConfig.id === "classic";
    if (isClassicLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("font-sans", "font-sans")}>
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-wide mb-2 text-slate-900">{personalInfo.fullName}</h1>
                    <div className="text-sm text-slate-600 flex justify-center gap-3 font-medium">
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.phone && personalInfo.email && <span>•</span>}
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.linkedin && personalInfo.email && <span>•</span>}
                        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                        {personalInfo.website && personalInfo.linkedin && <span>•</span>}
                        {personalInfo.website && <span>{personalInfo.website}</span>}
                        {personalInfo.location && <span>•</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                    </div>
                </div>

                <div className="h-1 bg-slate-900 w-full mb-6"></div>

                {personalInfo.jobTitle && (
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-slate-800">{personalInfo.jobTitle}</h2>
                        {summary && <p className="text-center text-slate-700 max-w-3xl mx-auto leading-relaxed">{summary}</p>}
                    </div>
                )}

                <div className="h-px bg-slate-300 w-full mb-6"></div>

                {skills.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-center text-base font-bold uppercase tracking-wider mb-4 text-slate-900">Key Skills</h3>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 max-w-3xl mx-auto">
                            {skills.map(skill => (
                                <span key={skill.id} className="text-slate-700 font-medium">{skill.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {skills.length > 0 && <div className="h-px bg-slate-300 w-full mb-6"></div>}

                {experience.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-center text-base font-bold uppercase tracking-wider mb-6 text-slate-900">Professional Experience</h3>
                        <div className="space-y-6">
                            {experience.map(job => (
                                <div key={job.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-lg text-slate-900">{job.jobTitle}</span>
                                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{job.startDate} – {job.endDate}</span>
                                    </div>
                                    <div className="font-bold text-slate-700 mb-2">{job.company}, {job.location}</div>
                                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {experience.length > 0 && <div className="h-px bg-slate-300 w-full my-6"></div>}

                {education.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-center text-base font-bold uppercase tracking-wider mb-6 text-slate-900">Education</h3>
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                                        <span>{edu.school}, {edu.location}</span>
                                        <span className="text-sm">{edu.startDate} – {edu.endDate}</span>
                                    </div>
                                    <div className="text-slate-800">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Ivy League Layout (Serif, Traditional)
    const isIvyLayout = templateConfig.id === "ivy";
    if (isIvyLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("font-sans", "font-serif").replace("text-slate-700", "text-black")}>
                <div className="text-center mb-8 pb-4 border-b border-black">
                    <h1 className="text-3xl font-serif text-black mb-2 uppercase tracking-widest">{personalInfo.fullName}</h1>
                    <div className="text-sm text-black flex justify-center gap-3 font-serif italic">
                        <span>{personalInfo.location}</span>
                        <span>|</span>
                        <span>{personalInfo.email}</span>
                        <span>|</span>
                        <span>{personalInfo.phone}</span>
                        {personalInfo.linkedin && <span>|</span>}
                        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    </div>
                </div>

                {summary && (
                    <div className="mb-6">
                        <h3 className="uppercase tracking-widest text-sm font-bold border-b border-gray-300 mb-3 pb-1">Summary</h3>
                        <p className="text-sm leading-relaxed text-justify">{summary}</p>
                    </div>
                )}

                {experience.length > 0 && (
                    <div className="mb-6">
                        <h3 className="uppercase tracking-widest text-sm font-bold border-b border-gray-300 mb-4 pb-1">Experience</h3>
                        <div className="space-y-5">
                            {experience.map(job => (
                                <div key={job.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-base">{job.company}</span>
                                        <span className="text-sm italic">{job.startDate} – {job.endDate}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="italic text-sm font-semibold">{job.jobTitle}</span>
                                        <span className="text-sm">{job.location}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-justify">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {education.length > 0 && (
                    <div className="mb-6">
                        <h3 className="uppercase tracking-widest text-sm font-bold border-b border-gray-300 mb-4 pb-1">Education</h3>
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-bold text-base">{edu.school}</span>
                                        <span className="text-sm italic">{edu.endDate}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="italic text-sm">{edu.degree}</span>
                                        <span className="text-sm">{edu.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skills.length > 0 && (
                    <div className="mb-6">
                        <h3 className="uppercase tracking-widest text-sm font-bold border-b border-gray-300 mb-3 pb-1">Additional Information</h3>
                        <div className="text-sm">
                            <span className="font-bold">Skills: </span>
                            {skills.map(skill => skill.name).join(", ")}
                        </div>
                    </div>
                )}
            </div>
        );
    }



    // Timeline Modern Layout (From Reference Image 1)
    const isTimelineLayout = templateConfig.id === "timeline";
    if (isTimelineLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("p-12", "")}>
                {/* Dark Header */}
                <div className="bg-slate-900 text-white p-10 pb-12" style={{ backgroundColor: templateConfig.color }}>
                    <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{personalInfo.fullName}</h1>
                    <p className="text-xl opacity-90 font-medium mb-6">{personalInfo.jobTitle}</p>

                    <div className="flex flex-wrap gap-8 text-sm font-medium opacity-80">
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{personalInfo.phone}</div>}
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{personalInfo.email}</div>}
                        {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4" />{personalInfo.linkedin}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{personalInfo.location}</div>}
                    </div>
                </div>

                <div className="pl-24 pr-10 py-12 relative min-h-[inherit]">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[48px] top-12 bottom-12 w-0.5 bg-slate-300"></div>

                    {summary && (
                        <div className="mb-10 relative">
                            <div className="absolute -left-[64px] top-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center z-10 border-4 border-white" style={{ backgroundColor: templateConfig.color }}>
                                <User className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-800">Profile</h3>
                            <p className="text-slate-700 leading-relaxed text-sm">{summary}</p>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="mb-10 relative">
                            <div className="absolute -left-[64px] top-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center z-10 border-4 border-white" style={{ backgroundColor: templateConfig.color }}>
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-slate-800">Experience</h3>
                            <div className="space-y-8">
                                {experience.map(job => (
                                    <div key={job.id} className="relative">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[52px] top-1.5 w-2 h-2 rounded-full bg-slate-400 ring-4 ring-white"></div>

                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-slate-900 text-base">{job.jobTitle}</h4>
                                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{job.startDate} – {job.endDate}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-600 mb-2">{job.company}, {job.location}</div>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="mb-10 relative">
                            <div className="absolute -left-[64px] top-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center z-10 border-4 border-white" style={{ backgroundColor: templateConfig.color }}>
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-slate-800">Education</h3>
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div key={edu.id} className="relative">
                                        <div className="absolute -left-[52px] top-1.5 w-2 h-2 rounded-full bg-slate-400 ring-4 ring-white"></div>
                                        <div className="font-bold text-slate-900">{edu.school}</div>
                                        <div className="text-sm text-slate-600 italic mb-1">{edu.degree}</div>
                                        <div className="text-xs text-slate-500">{edu.startDate} – {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills.length > 0 && (
                        <div className="relative">
                            <div className="absolute -left-[64px] top-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center z-10 border-4 border-white" style={{ backgroundColor: templateConfig.color }}>
                                <Wrench className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-slate-800">Skills</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {skills.map(skill => (
                                    <div key={skill.id} className="flex items-center gap-2 relative">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rotate-45"></div>
                                        <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Right Sidebar Layout (From Reference Image 2)
    const isRightSidebarLayout = templateConfig.id === "right-sidebar";
    if (isRightSidebarLayout) {
        return (
            <div id="resume-preview" className={containerClasses.replace("p-12", "").replace("grid-cols-[30%_70%]", "") + " grid grid-cols-[65%_35%] min-h-[29.7cm]"}>
                {/* Main Content (Left) */}
                <div className="p-10 space-y-8 bg-white h-full">
                    {summary && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4" style={{ borderColor: templateConfig.color }}>Professional Summary</h3>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium text-justify">{summary}</p>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6" style={{ borderColor: templateConfig.color }}>Experience</h3>
                            <div className="space-y-8">
                                {experience.map(job => (
                                    <div key={job.id}>
                                        <div className="flex justify-between font-bold text-slate-900 text-base mb-1">
                                            <span>{job.jobTitle}</span>
                                            <span className="text-xs text-slate-500 font-semibold pt-1">{job.startDate} – {job.endDate}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-600 mb-2 italic">{job.company}, {job.location}</div>
                                        <ul className="list-disc ml-4 space-y-1">
                                            {job.description.split('\n').map((line, i) => (
                                                line.trim() && <li key={i} className="text-xs text-slate-700 leading-relaxed pl-1">{line.trim().replace(/^-\s*/, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 mt-8" style={{ borderColor: templateConfig.color }}>Education</h3>
                            {education.map(edu => (
                                <div key={edu.id} className="mb-4">
                                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                                        <span>{edu.degree}</span>
                                        <span className="text-xs text-slate-500">{edu.endDate}</span>
                                    </div>
                                    <div className="text-sm text-slate-600 italic">{edu.school}, {edu.location}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar (Right) */}
                <div className="text-white p-8 space-y-8 h-full min-h-[inherit]" style={{ backgroundColor: templateConfig.color }}>
                    <div className="space-y-1 pt-12">
                        <h1 className="text-3xl font-bold leading-tight">{personalInfo.fullName}</h1>
                        <p className="text-lg opacity-80 font-medium">{personalInfo.jobTitle}</p>
                    </div>

                    <div className="space-y-4 pt-6 text-sm opacity-90">
                        <h3 className="uppercase tracking-widest font-bold border-b border-white/30 pb-2 mb-4 text-xs">Personal Info</h3>
                        {personalInfo.location && (
                            <div className="mb-2">
                                <div className="font-bold text-xs opacity-70">Address</div>
                                <div>{personalInfo.location}</div>
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="mb-2">
                                <div className="font-bold text-xs opacity-70">Phone</div>
                                <div>{personalInfo.phone}</div>
                            </div>
                        )}
                        {personalInfo.email && (
                            <div className="mb-2">
                                <div className="font-bold text-xs opacity-70">E-mail</div>
                                <div className="break-all">{personalInfo.email}</div>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="mb-2">
                                <div className="font-bold text-xs opacity-70">LinkedIn</div>
                                <div className="break-all text-xs">{personalInfo.linkedin}</div>
                            </div>
                        )}
                    </div>

                    {skills.length > 0 && (
                        <div className="pt-2">
                            <h3 className="uppercase tracking-widest font-bold border-b border-white/30 pb-2 mb-4 text-xs">Skills</h3>
                            <div className="space-y-3">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="flex justify-between text-xs mb-1 font-medium">
                                            <span>{skill.name}</span>
                                            <span className="opacity-70">{skill.level}</span>
                                        </div>
                                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full" style={{ width: skill.level === "Expert" ? "100%" : skill.level === "Experienced" ? "80%" : skill.level === "Skillful" ? "60%" : "40%" }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <h3 className="uppercase tracking-widest font-bold border-b border-white/30 pb-2 mb-4 text-xs">Languages</h3>
                        <div className="space-y-3">
                            <div className="text-xs">
                                <div className="flex justify-between mb-1"><span>English</span><span className="opacity-70">Native</span></div>
                                <div className="h-1 bg-white/20 rounded-full"><div className="h-full bg-white w-full rounded-full"></div></div>
                            </div>
                        </div>
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
