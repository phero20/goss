"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

export function ResumePreview() {
    const { personalInfo, experience, education, skills, summary } = useSelector((state: RootState) => state.resume);

    return (
        <div id="resume-preview" className="bg-white text-black font-sans min-h-[29.7cm] w-[21cm] mx-auto p-12 shadow-2xl print:shadow-none print:w-full print:max-w-none print:min-h-0 print:mx-0 print:p-0">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                <h2 className="text-xl text-slate-600 font-medium mb-4">
                    {personalInfo.jobTitle || "Professional Title"}
                </h2>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
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

            {/* Summary */}
            {summary && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                        Professional Summary
                    </h3>
                    <p className="text-slate-800 leading-relaxed text-sm">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                        Experience
                    </h3>
                    <div className="space-y-6">
                        {experience.map((job) => (
                            <div key={job.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-slate-900">{job.jobTitle}</h4>
                                    <span className="text-sm text-slate-500 font-medium">
                                        {job.startDate} – {job.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-700 font-medium">{job.company}</span>
                                    <span className="text-xs text-slate-500">{job.location}</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {job.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                        Education
                    </h3>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-slate-900">{edu.school}</h4>
                                    <span className="text-sm text-slate-500 font-medium">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-700">{edu.degree}</span>
                                    <span className="text-xs text-slate-500">{edu.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="bg-slate-100 text-slate-800 px-3 py-1 rounded text-sm font-medium"
                            >
                                {skill.name} <span className="text-slate-400 font-normal">| {skill.level}</span>
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
