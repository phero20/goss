"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Education, addEducation, removeEducation, updateEducation } from "@/redux/features/resumeSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

export function EducationForm() {
    const dispatch = useDispatch<AppDispatch>();
    const educationList = useSelector((state: RootState) => state.resume.education);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const hasInitialized = useRef(false);

    // Auto-add an empty education if none exist on mount
    useEffect(() => {
        if (!hasInitialized.current && educationList.length === 0) {
            hasInitialized.current = true;
            handleAddEducation();
        }
    }, []);

    const handleAddEducation = () => {
        const newEducation: Education = {
            id: uuidv4(),
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
            location: "",
        };
        dispatch(addEducation(newEducation));
        setExpandedId(newEducation.id);
    };

    const handleRemoveEducation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(removeEducation(id));
        if (expandedId === id) setExpandedId(null);
    };

    const handleChange = (id: string, field: keyof Education, value: string) => {
        const edu = educationList.find(e => e.id === id);
        if (edu) {
            dispatch(updateEducation({ ...edu, [field]: value }));
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Tell us about your education
                </h1>
                <p className="text-muted-foreground text-base">
                    Include every school, even if you're still there or didn't graduate.
                </p>
            </div>

            <div className="space-y-4">
                {educationList.map((edu, index) => (
                    <div
                        key={edu.id}
                        className={cn(
                            "rounded-xl bg-card transition-all duration-200",
                            expandedId === edu.id ? "ring-2 ring-primary/50 shadow-lg" : "border-2 border-border hover:border-primary/50"
                        )}
                    >
                        {/* Header / Summary View */}
                        <div
                            onClick={() => toggleExpand(edu.id)}
                            className="flex items-center justify-between p-4 cursor-pointer select-none"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">
                                        {edu.school || "(Not specified)"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {edu.degree || "Degree"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={(e) => handleRemoveEducation(edu.id, e)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                {expandedId === edu.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </div>
                        </div>

                        {/* Expanded Form */}
                        {expandedId === edu.id && (
                            <div className="p-4 pt-0 border-t border-border/50 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="space-y-3">
                                        <Label htmlFor={`school-${edu.id}`} className="text-sm font-medium">School Name</Label>
                                        <Input
                                            id={`school-${edu.id}`}
                                            value={edu.school}
                                            onChange={(e) => handleChange(edu.id, "school", e.target.value)}
                                            placeholder="e.g. University of Hyderabad"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor={`degree-${edu.id}`} className="text-sm font-medium">Degree</Label>
                                        <Input
                                            id={`degree-${edu.id}`}
                                            value={edu.degree}
                                            onChange={(e) => handleChange(edu.id, "degree", e.target.value)}
                                            placeholder="e.g. Bachelor of Technology"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="space-y-3">
                                        <Label htmlFor={`startDate-${edu.id}`} className="text-sm font-medium">Start Date</Label>
                                        <Input
                                            id={`startDate-${edu.id}`}
                                            value={edu.startDate}
                                            onChange={(e) => handleChange(edu.id, "startDate", e.target.value)}
                                            placeholder="MM/YYYY"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor={`endDate-${edu.id}`} className="text-sm font-medium">End Date</Label>
                                        <Input
                                            id={`endDate-${edu.id}`}
                                            value={edu.endDate}
                                            onChange={(e) => handleChange(edu.id, "endDate", e.target.value)}
                                            placeholder="MM/YYYY or Present"
                                            className="h-14 bg-background text-base"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 mt-6">
                                    <Label htmlFor={`location-${edu.id}`} className="text-sm font-medium">Location</Label>
                                    <Input
                                        id={`location-${edu.id}`}
                                        value={edu.location}
                                        onChange={(e) => handleChange(edu.id, "location", e.target.value)}
                                        placeholder="e.g. Hyderabad, India"
                                        className="h-14 bg-background text-base"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <Button
                    onClick={handleAddEducation}
                    variant="outline"
                    className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary gap-2"
                >
                    <Plus className="w-4 h-4" /> Add One More School
                </Button>
            </div>
        </div>
    );
}
