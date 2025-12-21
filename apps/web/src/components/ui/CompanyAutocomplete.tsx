"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CompanyAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    className?: string;
}

export function CompanyAutocomplete({
    value,
    onChange,
    id,
    placeholder = "e.g. Google",
    className
}: CompanyAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<{ name: string, domain: string, logo: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (value && value.length > 1) {
                try {
                    const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(value)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                        setShowSuggestions(true);
                    }
                } catch (e) {
                    console.error("Failed to fetch companies", e);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div ref={wrapperRef} className="relative group">
            <Input
                id={id}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    if (e.target.value.length <= 1) setShowSuggestions(false);
                }}
                onFocus={() => { if (value?.length > 1) setShowSuggestions(true); }}
                placeholder={placeholder}
                className={cn("bg-background", className)}
                autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((company, i) => (
                        <li
                            key={i}
                            className="px-4 py-3 hover:bg-muted cursor-pointer text-sm border-b border-border/50 last:border-0 transition-colors flex items-center gap-3"
                            onClick={() => {
                                onChange(company.name);
                                setShowSuggestions(false);
                            }}
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground">{company.name}</span>
                                <span className="text-xs text-muted-foreground">{company.domain}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
