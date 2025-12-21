"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    className?: string;
}

export function LocationAutocomplete({
    value,
    onChange,
    id,
    placeholder = "e.g. New York, USA",
    className
}: LocationAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<{ name: string, country: string, state?: string, label: string }[]>([]);
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
            if (value && value.length > 2) {
                try {
                    // Using Photon API (OpenStreetMap based) - completely free and no key required
                    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5&lang=en`);
                    if (res.ok) {
                        const data = await res.json();
                        const locations = data.features.map((f: any) => ({
                            name: f.properties.name,
                            city: f.properties.city,
                            state: f.properties.state,
                            country: f.properties.country
                        })).map((l: any) => {
                            // Format: "City, State, Country" or "Name, Country"
                            const parts = [l.name || l.city, l.state, l.country].filter(Boolean);
                            return {
                                label: parts.join(", "),
                                ...l
                            };
                        });

                        // Remove duplicates based on label
                        const unique = locations.filter((v: any, i: number, a: any) => a.findIndex((t: any) => t.label === v.label) === i);

                        setSuggestions(unique);
                        setShowSuggestions(true);
                    }
                } catch (e) {
                    console.error("Failed to fetch locations", e);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div ref={wrapperRef} className="relative">
            <Input
                id={id}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    if (e.target.value.length <= 2) setShowSuggestions(false);
                }}
                onFocus={() => { if (value?.length > 2) setShowSuggestions(true); }}
                placeholder={placeholder}
                className={cn("bg-background", className)}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((loc, i) => (
                        <li
                            key={i}
                            className="px-4 py-3 hover:bg-muted cursor-pointer text-sm border-b border-border/50 last:border-0 transition-colors flex items-center gap-2"
                            onClick={() => {
                                onChange(loc.label);
                                setShowSuggestions(false);
                            }}
                        >
                            <span className="text-muted-foreground">📍</span>
                            <div className="font-medium text-foreground">{loc.label}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
