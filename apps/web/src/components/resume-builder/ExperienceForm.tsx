"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Experience, addExperience, removeExperience, updateExperience } from "@/redux/features/resumeSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function ExperienceForm() {
    const dispatch = useDispatch<AppDispatch>();
    const experiences = useSelector((state: RootState) => state.resume.experience);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const hasInitialized = useRef(false);

    // Auto-add an empty experience if none exist on mount
    useEffect(() => {
        if (!hasInitialized.current && experiences.length === 0) {
            hasInitialized.current = true;
            handleAddExperience();
        }
    }, []); // Run once on mount

    const handleAddExperience = () => {
        const newExperience: Experience = {
            id: uuidv4(),
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            location: "",
            description: "",
        };
        dispatch(addExperience(newExperience));
        setExpandedId(newExperience.id);
    };

    const handleRemoveExperience = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(removeExperience(id));
        if (expandedId === id) setExpandedId(null);
    };

    const handleChange = (id: string, field: keyof Experience, value: string) => {
        const exp = experiences.find(e => e.id === id);
        if (exp) {
            dispatch(updateExperience({ ...exp, [field]: value }));
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pt-24 px-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Tell us about your experience
                </h1>
                <p className="text-muted-foreground text-base">
                    Start with your most recent job and work backwards.
                </p>
            </div>

            <div className="space-y-4">
                {experiences.map((exp, index) => (
                    <div
                        key={exp.id}
                        className={cn(
                            " rounded-xl bg-card transition-all duration-200",
                            expandedId === exp.id ? "ring-2 ring-primary/50 shadow-lg" : "border-2 border-border hover:border-primary/50"
                        )}
                    >
                        {/* Header / Summary View */}
                        <div
                            onClick={() => toggleExpand(exp.id)}
                            className="flex items-center justify-between p-4 cursor-pointer select-none"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">
                                        {exp.jobTitle || "(Not specified)"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {exp.company || "Company Name"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={(e) => handleRemoveExperience(exp.id, e)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                {expandedId === exp.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </div>
                        </div>

                        {/* Expanded Form */}
                        {expandedId === exp.id && (
                            <div className="p-4 pt-0 border-t border-border/50 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="space-y-3">
                                        <Label htmlFor={`jobTitle-${exp.id}`} className="text-sm font-medium">Job Title</Label>
                                        <Input
                                            id={`jobTitle-${exp.id}`}
                                            value={exp.jobTitle}
                                            onChange={(e) => handleChange(exp.id, "jobTitle", e.target.value)}
                                            placeholder="e.g. Senior Software Engineer"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor={`company-${exp.id}`} className="text-sm font-medium">Company</Label>
                                        <Input
                                            id={`company-${exp.id}`}
                                            value={exp.company}
                                            onChange={(e) => handleChange(exp.id, "company", e.target.value)}
                                            placeholder="e.g. Google"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="space-y-3">
                                        <Label htmlFor={`startDate-${exp.id}`} className="text-sm font-medium">Start Date</Label>
                                        <Input
                                            id={`startDate-${exp.id}`}
                                            value={exp.startDate}
                                            onChange={(e) => handleChange(exp.id, "startDate", e.target.value)}
                                            placeholder="MM/YYYY"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor={`endDate-${exp.id}`} className="text-sm font-medium">End Date</Label>
                                        <Input
                                            id={`endDate-${exp.id}`}
                                            value={exp.endDate}
                                            onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                                            placeholder="MM/YYYY or Present"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 mt-6">
                                    <Label htmlFor={`location-${exp.id}`} className="text-sm font-medium">Location</Label>
                                    <Input
                                        id={`location-${exp.id}`}
                                        value={exp.location}
                                        onChange={(e) => handleChange(exp.id, "location", e.target.value)}
                                        placeholder="e.g. New York, NY"
                                        className="h-14 bg-background text-base"
                                    />
                                </div>

                                <div className="space-y-3 mt-6">
                                    <Label htmlFor={`description-${exp.id}`} className="text-sm font-medium">Description</Label>
                                    <Textarea
                                        id={`description-${exp.id}`}
                                        value={exp.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(exp.id, "description", e.target.value)}
                                        placeholder="Describe your responsibilities and achievements..."
                                        className="min-h-[150px] bg-background text-base resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <Button
                    onClick={handleAddExperience}
                    variant="outline"
                    className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary gap-2"
                >
                    <Plus className="w-4 h-4" /> Add One More Position
                </Button>
            </div>
        </div>
    );
}
