"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { DynamicResumePreview } from "./DynamicResumePreview";
import { Button } from "@/components/ui/button";
import { Download, Printer, Palette, ArrowLeft, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateTemplateConfig } from "@/redux/features/resumeSlice";
import { cn } from "@/lib/utils";

const templates = [
    { id: "modern", name: "Modern Professional", description: "Clean and balanced." },
    { id: "sidebar", name: "Creative Sidebar", description: " distinct side column." },
    { id: "minimal", name: "Elegant Minimal", description: "Centered, ample whitespace." },
    { id: "technical", name: "Technical Compact", description: "Data-dense, 2-column body." },
    { id: "bold", name: "Bold Modern", description: "High impact color header." },
];

const colors = [
    { name: "Slate", value: "#0f172a" },
    { name: "Blue", value: "#2563eb" },
    { name: "Purple", value: "#7c3aed" },
    { name: "Emerald", value: "#059669" },
    { name: "Red", value: "#dc2626" },
    { name: "Pink", value: "#db2777" },
    { name: "Orange", value: "#ea580c" },
    { name: "Teal", value: "#0d9488" },
    { name: "Cyan", value: "#0891b2" },
    { name: "Indigo", value: "#4f46e5" },
];

export function FinalizeStep() {
    const dispatch = useDispatch<AppDispatch>();
    const templateConfig = useSelector((state: RootState) => state.resume.templateConfig);
    const [viewMode, setViewMode] = useState<"gallery" | "editor">("gallery");

    const handlePrint = () => {
        window.print();
    };

    const handleTemplateSelect = (id: string) => {
        dispatch(updateTemplateConfig({ id }));
        setViewMode("editor");
    };

    // Gallery View
    if (viewMode === "gallery") {
        return (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Choose your template
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Select a design to start customizing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className="group relative cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Mini Preview Window */}
                            <div className="aspect-[210/297] w-full bg-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-[210mm] h-[297mm] transform origin-top-left scale-[0.25] sm:scale-[0.33] pointer-events-none select-none p-8">
                                    <DynamicResumePreview overrideConfig={{ id: template.id }} />
                                </div>
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />

                                {/* Select Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        Use Template
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border">
                                <h3 className="font-semibold text-foreground flex items-center justify-between">
                                    {template.name}
                                    {templateConfig.id === template.id && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </h3>
                                <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Helper component for auto-scaling
    function AutoZoomWrapper({ children }: { children: ReactNode }) {
        const [scale, setScale] = useState(1);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const updateScale = () => {
                if (!containerRef.current) return;

                const parent = containerRef.current.parentElement;
                if (!parent) return;

                // Accurately calculate available width inside the parent's padding
                const style = window.getComputedStyle(parent);
                const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

                const availableWidth = parent.clientWidth - paddingX;

                const contentWidth = 794; // A4 pixel width

                // Calculate "Fit Width" scale
                const scaleW = availableWidth / contentWidth;

                // Cap at 1.2 to avoid excessive zooming
                const fitScale = Math.min(scaleW, 1.2);

                setScale(fitScale);
            };

            const resizeObserver = new ResizeObserver(updateScale);
            if (containerRef.current.parentElement) {
                resizeObserver.observe(containerRef.current.parentElement);
            }
            // Also listen to window resize for responsive padding changes
            window.addEventListener("resize", updateScale);

            return () => {
                resizeObserver.disconnect();
                window.removeEventListener("resize", updateScale);
            };
        }, []);

        // The wrapper size sent to Flexbox is the SCALED size.
        const scaledWidth = 794 * scale;
        const scaledHeight = 1123 * scale;

        return (
            <div
                ref={containerRef}
                className="relative shadow-sm origin-center bg-white"
                style={{
                    // Flexbox sees this explicit small size and centers it perfectly
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                }}
            >
                <div
                    style={{
                        width: "794px",
                        height: "1123px",
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                >
                    {children}
                </div>
            </div>
        );
    }

    // Editor View
    return (
        <div className="w-full h-[calc(100vh)] flex flex-col">

            {/* Top Toolbar Control Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 md:p-4 border-b border-border bg-card/50 backdrop-blur-sm z-10 shadow-sm shrink-0">

                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setViewMode("gallery")}
                    >
                        <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Templates</span>
                    </Button>

                    <div className="h-6 w-px bg-border hidden md:block" />

                    <div className="flex items-center gap-2 bg-muted/30 px-2 py-1.5 rounded-full border border-border/50 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                        <Palette className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex gap-1.5">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => dispatch(updateTemplateConfig({ color: c.value }))}
                                    className={cn(
                                        "w-5 h-5 rounded-full border border-black/10 transition-all hover:scale-125 focus:scale-125 hover:shadow-sm shrink-0",
                                        templateConfig.color === c.value
                                            ? "ring-2 ring-primary/20 scale-125 shadow-sm"
                                            : "opacity-80 hover:opacity-100"
                                    )}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center">
                    <p className="hidden lg:block text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">Pro Tip:</span> Save as PDF
                    </p>
                    <Button onClick={handlePrint} className="gap-2 shadow-lg hover:shadow-xl transition-all w-full md:w-auto">
                        <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">Download</span>
                    </Button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex justify-center p-4 md:p-8 bg-slate-100/50 bg-grid-slate-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <AutoZoomWrapper>
                    <DynamicResumePreview />
                </AutoZoomWrapper>
            </div>
        </div>
    );
}
