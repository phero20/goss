"use client";

import { cn } from "@/lib/utils";
import { calculateScore } from "@/lib/score";
import { Check, ChevronRight, Lightbulb, TrendingUp, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ScoreIndicatorProps {
    score: number;
    tips: string[];
    className?: string;
}

export function ScoreIndicator({ score, tips, className }: ScoreIndicatorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Color logic
    let colorClass = "text-red-500 border-red-500";
    let bgClass = "bg-red-50";
    if (score >= 70) {
        colorClass = "text-emerald-500 border-emerald-500";
        bgClass = "bg-emerald-50";
    } else if (score >= 40) {
        colorClass = "text-yellow-500 border-yellow-500";
        bgClass = "bg-yellow-50";
    }

    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative" ref={containerRef}>
            <div
                
                className={cn(
                    "group relative flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 cursor-pointer transition-all hover:shadow-md",
                    className
                )}
            >
                {/* Circular Progress */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-muted/20"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={cn("transition-all duration-1000 ease-out", colorClass)}
                        />
                    </svg>
                    <span className="absolute text-[10px] font-bold">{Math.round(score)}</span>
                </div>

                <div className="flex-1 text-left">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume Score</p>
                    <div className="flex items-center gap-1">
                        <span className={cn("text-sm font-bold", colorClass.split(' ')[0])}>
                            {score >= 70 ? "Excellent" : score >= 40 ? "Getting There" : "Needs Work"}
                        </span>
                        {/* <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                    </div>
                </div>
            </div>

            {/* Custom Popover Content */}
        
        </div>
    );
}
