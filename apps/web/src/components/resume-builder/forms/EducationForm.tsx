"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Education, addEducation, removeEducation, updateEducation } from "@/redux/features/resumeSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";

// Helper Component for University Autocomplete
function SchoolAutocomplete({ value, onChange, id }: { value: string, onChange: (val: string) => void, id: string }) {
    const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
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
                    const res = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(value)}`);
                    if (res.ok) {
                        const data = await res.json();
                        // Limit to 5 results for cleaner UI
                        setSuggestions(data.slice(0, 5));
                        setShowSuggestions(true);
                    }
                } catch (e) {
                    console.error("Failed to fetch universities", e);
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
                placeholder="e.g. Stanford University"
                className="h-14 bg-background text-base"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((school, i) => (
                        <li
                            key={i}
                            className="px-4 py-3 hover:bg-muted cursor-pointer text-sm border-b border-border/50 last:border-0 transition-colors"
                            onClick={() => {
                                onChange(school.name);
                                setShowSuggestions(false);
                            }}
                        >
                            <div className="font-medium text-foreground">{school.name}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ------------------------------------------------------------------
// DATA: Common Degrees List (Static)
// ------------------------------------------------------------------
const COMMON_DEGREES = [
    "No Degree",
    "High School Diploma",
    "GED",
    "Associate of Arts (AA)",
    "Associate of Science (AS)",
    "Associate of Applied Science (AAS)",
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BS)",
    "Bachelor of Fine Arts (BFA)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Engineering (B.E)",
    "Bachelor of Architecture (B.Arch)",
    "Master of Arts (MA)",
    "Master of Science (MS)",
    "Master of Business Administration (MBA)",
    "Master of Fine Arts (MFA)",
    "Master of Education (M.Ed)",
    "Master of Technology (M.Tech)",
    "Doctor of Philosophy (PhD)",
    "Doctor of Medicine (MD)",
    "Juris Doctor (JD)",
    "Diploma",
    "Certificate",
];

// Helper Component for Degree Selector (Dropdown + Custom)
function DegreeSelector({ value, onChange, id }: { value: string, onChange: (val: string) => void, id: string }) {
    const [suggestions, setSuggestions] = useState<string[]>(COMMON_DEGREES);
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

    const handleInput = (input: string) => {
        onChange(input);
        if (input.length > 0) {
            const filtered = COMMON_DEGREES.filter(d =>
                d.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions(COMMON_DEGREES);
            setShowSuggestions(true);
        }
    };

    const handleFocus = () => {
        // Always show full list on focus unless there is a filter
        if (!value) {
            setSuggestions(COMMON_DEGREES);
        } else {
            const filtered = COMMON_DEGREES.filter(d =>
                d.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        }
        setShowSuggestions(true);
    };

    return (
        <div ref={wrapperRef} className="relative group">
            <div className="relative">
                <Input
                    id={id}
                    value={value}
                    onChange={(e) => handleInput(e.target.value)}
                    onFocus={handleFocus}
                    placeholder="Select or type your degree..."
                    className="h-14 bg-background text-base pr-10"
                    autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((degree, i) => (
                        <li
                            key={i}
                            className={cn(
                                "px-4 py-3 cursor-pointer text-sm border-b border-border/50 last:border-0 transition-colors flex items-center justify-between",
                                degree === value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
                            )}
                            onClick={() => {
                                onChange(degree);
                                setShowSuggestions(false);
                            }}
                        >
                            <span>{degree}</span>
                            {degree === value && <Check className="w-4 h-4" />}
                        </li>
                    ))}
                    {suggestions.length === 0 && (
                        <li className="px-4 py-3 text-sm text-muted-foreground italic">
                            "{value}" will be saved as custom degree
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

// Helper Component for Location Autocomplete (Photon API)
function LocationAutocomplete({ value, onChange, id }: { value: string, onChange: (val: string) => void, id: string }) {
    const [suggestions, setSuggestions] = useState<{ name: string, country: string, state?: string }[]>([]);
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
                placeholder="e.g. New York, USA"
                className="h-14 bg-background text-base"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((loc: any, i) => (
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
        <div className="max-w-3xl mx-auto space-y-8 pt-24 px-6">
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
                                        <SchoolAutocomplete
                                            id={`school-${edu.id}`}
                                            value={edu.school}
                                            onChange={(val) => handleChange(edu.id, "school", val)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor={`degree-${edu.id}`} className="text-sm font-medium">Degree</Label>
                                        <DegreeSelector
                                            id={`degree-${edu.id}`}
                                            value={edu.degree}
                                            onChange={(val) => handleChange(edu.id, "degree", val)}
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
                                    <LocationAutocomplete
                                        id={`location-${edu.id}`}
                                        value={edu.location}
                                        onChange={(val) => handleChange(edu.id, "location", val)}
                                        
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
