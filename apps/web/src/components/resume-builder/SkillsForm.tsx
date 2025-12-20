"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Skill, addSkill, removeSkill, updateSkill } from "@/redux/features/resumeSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SkillsForm() {
    const dispatch = useDispatch<AppDispatch>();
    const skills = useSelector((state: RootState) => state.resume.skills);
    const hasInitialized = useRef(false);

    // Auto-add an empty skill if none exist on mount
    useEffect(() => {
        if (!hasInitialized.current && skills.length === 0) {
            hasInitialized.current = true;
            handleAddSkill();
        }
    }, []);

    const handleAddSkill = () => {
        const newSkill: Skill = {
            id: uuidv4(),
            name: "",
            level: "Intermediate", // Default level
        };
        dispatch(addSkill(newSkill));
    };

    const handleRemoveSkill = (id: string) => {
        dispatch(removeSkill(id));
    };

    const handleChange = (id: string, field: keyof Skill, value: string) => {
        const skill = skills.find(s => s.id === id);
        if (skill) {
            dispatch(updateSkill({ ...skill, [field]: value }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pt-24 px-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    What skills do you want to highlight?
                </h1>
                <p className="text-muted-foreground text-base">
                    Recruiters scan for relevant skills. Add your top hard and soft skills.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {skills.map((skill, index) => (
                        <div
                            key={skill.id}
                            className="group flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all duration-200"
                        >
                            <div className="cursor-move text-muted-foreground/50 hover:text-foreground">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor={`skill-name-${skill.id}`} className="sr-only">Skill Name</Label>
                                    <Input
                                        id={`skill-name-${skill.id}`}
                                        value={skill.name}
                                        onChange={(e) => handleChange(skill.id, "name", e.target.value)}
                                        placeholder="e.g. Project Management"
                                        className="h-12 bg-background border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`skill-level-${skill.id}`} className="sr-only">Skill Level</Label>
                                    <Select
                                        value={skill.level}
                                        onValueChange={(value) => handleChange(skill.id, "level", value)}
                                    >
                                        <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                            <SelectItem value="Expert">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive transition-opacity"
                                onClick={() => handleRemoveSkill(skill.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={handleAddSkill}
                    variant="outline"
                    className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary gap-2"
                >
                    <Plus className="w-4 h-4" /> Add One More Skill
                </Button>
            </div>
        </div>
    );
}
