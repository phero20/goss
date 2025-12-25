"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Lightbulb, Loader2 } from "lucide-react";

interface SkillsAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    className?: string;
}

export function SkillsAutocomplete({
    value,
    onChange,
    id,
    placeholder = "e.g. React.js",
    className
}: SkillsAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce timer ref
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSkills = async (query: string) => {
        setIsLoading(true);
        try {
            // Using APILayer Skills API (Freemium)
            // Note: This requires an API Key in your .env file: NEXT_PUBLIC_SKILLS_API_KEY
            const apiKey = process.env.NEXT_PUBLIC_SKILLS_API_KEY || "YOUR_API_KEY_HERE";

            const myHeaders = new Headers();
            myHeaders.append("apikey", apiKey);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow' as RequestRedirect
            };

            const res = await fetch(`https://api.apilayer.com/skills?q=${encodeURIComponent(query)}&count=10`, requestOptions);

            if (res.ok) {
                const data = await res.json();
                // APILayer returns array of strings
                if (Array.isArray(data)) {
                    setSuggestions(data);
                    setShowSuggestions(data.length > 0);
                }
            } else {
                // Fallback if key is missing or invalid to avoid breaking UI
                console.warn("Skills API Error:", res.status);
            }
        } catch (e) {
            console.error("Failed to fetch skills", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInput = (input: string) => {
        onChange(input);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (input.length > 1) {
            timeoutRef.current = setTimeout(() => {
                fetchSkills(input);
            }, 400); // 400ms debounce
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={wrapperRef} className="relative group">
            <div className="relative">
                <Input
                    id={id}
                    value={value}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder={placeholder}
                    className={cn("bg-background pr-10", className)}
                    autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                    ) : (
                        <Lightbulb className="w-4 h-4 opacity-50" />
                    )}
                </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((skill, i) => (
                        <li
                            key={i}
                            className="px-4 py-3 hover:bg-muted cursor-pointer text-sm border-b border-border/50 last:border-0 transition-colors flex items-center justify-between"
                            onClick={() => {
                                onChange(skill);
                                setShowSuggestions(false);
                            }}
                        >
                            <span className="font-medium text-foreground">{skill}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
