"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { DynamicResumePreview } from "./preview/DynamicResumePreview";
import { Button } from "@/components/ui/button";
import { Download, Printer, Palette, ArrowLeft, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { AppDispatch, RootState } from "@/redux/store";
import { updateTemplateConfig } from "@/redux/features/resumeSlice";
import { cn } from "@/lib/utils";

// Recommended / Popular
const templates = [
    { id: "ivy", name: "Ivy League", description: "Standard, serif font, text-focused." },
    { id: "executive", name: "Executive Suite", description: "Professional, with photo header." },
    { id: "modern", name: "Modern Professional", description: "Clean and balanced." },
    { id: "classic", name: "Classic Professional", description: "Traditional, horizontal lines, centered." },

    // Modern & Creative
    { id: "timeline", name: "Timeline Modern", description: "Dark header, vertical timeline." },
    { id: "creative", name: "Creative Split", description: "Modern sidebar with large photo." },
    { id: "right-sidebar", name: "Right Sidebar", description: "Content left, dark info column right." },
    { id: "sidebar", name: "Creative Sidebar", description: "Clean distinct side column." },

    // Minimal & Specialized
    { id: "minimal-photo", name: "Minimal Photo", description: "Clean, centered with profile picture." },
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

// Helper for Gallery Thumbnails
function ThumbnailWrapper({ children }: { children: ReactNode }) {
    const [scale, setScale] = useState(0.25);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;
            // The container is the "Card" width.
            const availableWidth = containerRef.current.clientWidth;
            const contentWidth = 794; // A4

            // Just scale to fit width exactly
            const s = availableWidth / contentWidth;
            setScale(s);
        };

        const resizeObserver = new ResizeObserver(updateScale);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        window.addEventListener("resize", updateScale);

        // Initial scaling
        updateScale();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateScale);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-white">
            <div
                style={{
                    width: "794px",
                    height: "1123px",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    // Prevent interactions in thumbnail
                    pointerEvents: "none",
                    userSelect: "none"
                }}
            >
                {children}
            </div>
        </div>
    );
}

// Helper component for auto-scaling
function AutoZoomWrapper({ children }: { children: ReactNode }) {
    const [scale, setScale] = useState(1);
    const [contentHeight, setContentHeight] = useState(1123);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // 1. Calculate Scale based on available width
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
        const currentContainer = containerRef.current;
        if (currentContainer && currentContainer.parentElement) {
            resizeObserver.observe(currentContainer.parentElement);
        }
        // Also listen to window resize for responsive padding changes
        window.addEventListener("resize", updateScale);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateScale);
        };
    }, []);

    // 2. Observe Content Height to resize wrapper
    useEffect(() => {
        if (!contentRef.current) return;

        const updateHeight = () => {
            if (contentRef.current) {
                // Determine height: at least A4 (1123px)
                const h = Math.max(contentRef.current.offsetHeight, 1123);
                setContentHeight(h);
            }
        };

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(contentRef.current);

        // Initial measurement
        updateHeight();

        return () => resizeObserver.disconnect();
    }, []);

    // The wrapper size sent to Flexbox is the SCALED size.
    const scaledWidth = 794 * scale;
    const scaledHeight = contentHeight * scale;

    return (
        <div
            ref={containerRef}
            className="relative origin-center"
            style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
            }}
        >
            <div
                ref={contentRef}
                style={{
                    width: "794px",
                    minHeight: "1123px",
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

export function FinalizeStep() {
    const dispatch = useDispatch<AppDispatch>();
    const templateConfig = useSelector((state: RootState) => state.resume.templateConfig);
    const personalInfo = useSelector((state: RootState) => state.resume.personalInfo);
    const [viewMode, setViewMode] = useState<"gallery" | "editor">("gallery");

    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Resume - ${personalInfo?.fullName || "Candidate"}`,
        pageStyle: `
        @page {
            size: A4;
            margin: 0mm;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        `,
    });

    const handleTemplateSelect = (id: string) => {
        dispatch(updateTemplateConfig({ id }));
        setViewMode("editor");
    };

    // Gallery View
    if (viewMode === "gallery") {
        return (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in py-20 slide-in-from-bottom-4 duration-500 px-4">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Choose your template
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Select a design to start customizing.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className="group relative cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Mini Preview Window */}
                            <div className="aspect-210/267 w-full bg-slate-100 relative overflow-hidden">
                                <ThumbnailWrapper>
                                    <DynamicResumePreview overrideConfig={{ id: template.id }} />
                                </ThumbnailWrapper>
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />

                                {/* Select Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
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



    // Editor View
    return (
        <div className="w-full flex flex-col h-[calc(100vh)] ">

            {/* Top Toolbar Control Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 md:px-14 border-b border-border bg-white/80 backdrop-blur-md z-10 shadow-sm gap-4 transition-all">

                {/* Left: Navigation */}
                <div className="flex items-center w-full md:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="group gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setViewMode("gallery")}
                    >
                        <div className="p-1 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Templates</span>
                    </Button>
                </div>

                {/* Center: Color Studio */}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-3 bg-muted/40 px-4 py-3 md:py-2 rounded-2xl md:rounded-full border border-border/40 shadow-sm w-full md:w-auto">
                    <div className="flex items-center gap-2 pr-4 md:border-r md:border-border/50 mr-2 border-r-0 w-full md:w-auto justify-center md:justify-start mb-2 md:mb-0">
                        <Palette className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Theme</span>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {colors.slice(0, 5).map((c) => (
                            <button
                                key={c.value}
                                onClick={() => dispatch(updateTemplateConfig({ color: c.value }))}
                                className={cn(
                                    "w-6 h-6 rounded-full border border-black/5 transition-all hover:scale-110 focus:scale-110 hover:shadow-md",
                                    templateConfig.color === c.value
                                        ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm"
                                        : "hover:opacity-100"
                                )}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            />
                        ))}

                        {/* Custom Color Wheel */}
                        <div className="relative group ml-1">
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className={cn(
                                "relative w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95",
                                !colors.find(c => c.value === templateConfig.color) && "ring-2 ring-primary ring-offset-2"
                            )}>
                                <input
                                    type="color"
                                    value={templateConfig.color}
                                    onChange={(e) => dispatch(updateTemplateConfig({ color: e.target.value }))}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 cursor-pointer opacity-0"
                                    title="Custom Color"
                                />
                                <div
                                    className="w-full h-full pointer-events-none"
                                    style={{
                                        background: !colors.find(c => c.value === templateConfig.color)
                                            ? templateConfig.color
                                            : 'conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)'
                                    }}
                                />
                            </div>
                        </div>

                        {colors.slice(5).map((c) => (
                            <button
                                key={c.value}
                                onClick={() => dispatch(updateTemplateConfig({ color: c.value }))}
                                className={cn(
                                    "w-6 h-6 rounded-full border border-black/5 transition-all hover:scale-110 focus:scale-110 hover:shadow-md",
                                    templateConfig.color === c.value
                                        ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm"
                                        : "hover:opacity-100"
                                )}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Button
                        onClick={handlePrint}
                        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all bg-gradient-to-r from-primary to-primary/90 w-full md:w-auto"
                    >
                        <Printer className="w-4 h-4" />
                        <span className="font-semibold">Export PDF</span>
                    </Button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex justify-center p-4 md:p-8">
                <AutoZoomWrapper>
                    <div ref={contentRef}>
                        <DynamicResumePreview />
                    </div>
                </AutoZoomWrapper>
            </div>
        </div>
    );
}
