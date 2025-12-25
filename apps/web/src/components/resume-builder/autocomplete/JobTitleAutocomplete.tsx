"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

// Top 100+ Common Job Titles to cover most use cases
// Source: Aggregated from common job boards
const COMMON_JOB_TITLES = [
    "Accountant", "Account Executive", "Account Manager", "Administrative Assistant", "Administrator",
    "Advisor", "Analyst", "Architect", "Art Director", "Assistant Manager",
    "Associate", "Attorney", "Auditor", "Backend Engineer", "Barista",
    "Bartender", "Bookkeeper", "Brand Manager", "Business Analyst", "Business Development Manager",
    "Buyer", "Cashier", "CEO", "Chef", "Chief Executive Officer",
    "Chief Financial Officer", "Chief Operating Officer", "Chief Technology Officer", "Civil Engineer", "Clerk",
    "Cloud Architect", "Coach", "Communications Specialist", "Community Manager", "Consultant",
    "Content Creator", "Content Strategist", "Contractor", "Controller", "Coordinator",
    "Copywriter", "Creative Director", "Customer Service Representative", "Data Analyst", "Data Engineer",
    "Data Scientist", "Database Administrator", "Designer", "Developer", "DevOps Engineer",
    "Director", "Director of Operations", "District Manager", "Driver", "Editor",
    "Electrician", "Engineer", "Engineering Manager", "Event Coordinator", "Executive Assistant",
    "Factory Worker", "Finance Manager", "Financial Analyst", "Founder", "Freelancer",
    "Frontend Engineer", "Full Stack Developer", "General Manager", "Graphic Designer", "HR Manager",
    "Human Resources Specialist", "Intern", "IT Manager", "IT Specialist", "Java Developer",
    "Journalist", "Junior Developer", "Laborer", "Lawyer", "Leader",
    "Legal Assistant", "Machine Learning Engineer", "Maintenance Worker", "Manager", "Managing Director",
    "Marketing Coordinator", "Marketing Manager", "Marketing Specialist", "Mechanic", "Medical Assistant",
    "Merchandiser", "Mobile Developer", "Nurse", "Office Manager", "Operations Manager",
    "Operator", "Paralegal", "Pharmacist", "Photographer", "Physical Therapist",
    "Physician", "President", "Principal", "Product Designer", "Product Manager",
    "Product Owner", "Production Manager", "Professor", "Program Manager", "Project Coordinator",
    "Project Manager", "Public Relations Specialist", "QA Engineer", "Quality Assurance Specialist", "Receptionist",
    "Recruiter", "Regional Manager", "Registered Nurse", "Representative", "Researcher",
    "Restaurant Manager", "Retail Associate", "Sales Associate", "Sales Manager", "Sales Representative",
    "Scientist", "Scrum Master", "Secretary", "Security Guard", "Senior Accountant",
    "Senior Engineer", "Senior Manager", "Server", "Social Media Manager", "Software Architect",
    "Software Developer", "Software Engineer", "Solutions Architect", "Specialist", "Staff Engineer",
    "Store Manager", "Student", "Supervisor", "Support Specialist", "Systems Administrator",
    "Teacher", "Teacher Assistant", "Team Lead", "Technical Recruiter", "Technical Support",
    "Technical Writer", "Technician", "Teller", "Tester", "Therapist",
    "Trainer", "Truck Driver", "UI/UX Designer", "Underwriter", "Vice President",
    "Volunteer", "Waiter", "Waitress", "Warehouse Associate", "Warehouse Worker",
    "Web Designer", "Web Developer", "Writer"
];

interface JobTitleAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    className?: string;
}

export function JobTitleAutocomplete({
    value,
    onChange,
    id,
    placeholder = "e.g. Software Engineer",
    className
}: JobTitleAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
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
            const filtered = COMMON_JOB_TITLES.filter(title =>
                title.toLowerCase().includes(input.toLowerCase())
            );
            // Limit to 8 results for cleaner UI
            setSuggestions(filtered.slice(0, 8));
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleFocus = () => {
        if (value) {
            handleInput(value);
        } else {
            // Show some popular options on empty focus
            setSuggestions(COMMON_JOB_TITLES);
            setShowSuggestions(true);
        }
    };

    return (
        <div ref={wrapperRef} className="relative group">
            <div className="relative">
                <Input
                    id={id}
                    value={value}
                    onChange={(e) => handleInput(e.target.value)}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className={cn("bg-background pr-10", className)}
                    autoComplete="off"
                />
                {/* Visual indicator that this is a dropdown-capable field */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground opacity-50">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-50 w-full bg-card border border-border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((title, i) => (
                        <li
                            key={i}
                            className={cn(
                                "px-4 py-3 cursor-pointer text-sm border-b border-border/50 last:border-0 transition-colors flex items-center justify-between",
                                title === value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
                            )}
                            onClick={() => {
                                onChange(title);
                                setShowSuggestions(false);
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-muted-foreground opacity-50">💼</span>
                                {title}
                            </span>
                            {title === value && <Check className="w-4 h-4" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
