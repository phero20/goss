"use client";

import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Cloud, Eye, X, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { saveResume, fetchResume } from "@/redux/features/resumeSlice";
import { useEffect, useMemo, useState, useRef } from "react";
import { ScoreIndicator } from "@/components/resume-builder/ScoreIndicator";
import { calculateScore } from "@/lib/score";
import { ResumePreview } from "@/components/resume-builder/preview/ResumePreview";
import { useReactToPrint } from "react-to-print";

const steps = [
    { id: "personal", title: "Heading", order: 1 },
    { id: "experience", title: "Work History", order: 2 },
    { id: "education", title: "Education", order: 3 },
    { id: "skills", title: "Skills", order: 4 },
    { id: "summary", title: "Summary", order: 5 },
    { id: "finalize", title: "Finalize", order: 6 },
];

export default function SectionLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isSaving = useSelector((state: RootState) => state.resume.isSaving);
    const lastSaved = useSelector((state: RootState) => state.resume.lastSaved);
    const isDirty = useSelector((state: RootState) => state.resume.isDirty);
    const personalInfo = useSelector((state: RootState) => state.resume.personalInfo);

    // Preview Toggle State - Default false (closed)
    const [showPreview, setShowPreview] = useState(false);

    // Print logic
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: resumePreviewRef,
        documentTitle: `${personalInfo?.fullName || "Resume"}`,
    });

    // Determine current step based on URL
    const currentStepId = steps.find(step => pathname.includes(step.id))?.id || "personal";
    const currentStepIndex = steps.findIndex(s => s.id === currentStepId);

    // Calculate Score in real-time
    const resumeData = useSelector((state: RootState) => state.resume);
    const { score, tips } = useMemo(() => calculateScore(resumeData), [resumeData]);

    // Derived values
    const currentStepOrder = currentStepIndex + 1;
    const isFinalizeStep = currentStepId === "finalize";

    useEffect(() => {
        // Fetch resume data on mount to hydrate state (e.g. on refresh)
        dispatch(fetchResume());
    }, [dispatch]);

    const autoSaveAndNavigate = async (path: string) => {
        // Only save if dirty OR if we are finalizing (to be safe)
        if (isDirty || isFinalizeStep) {
            dispatch(saveResume());
        }
        router.push(path);
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextStepId = steps[currentStepIndex + 1].id;
            autoSaveAndNavigate(`/resume/section/${nextStepId}`);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            const prevStepId = steps[currentStepIndex - 1].id;
            autoSaveAndNavigate(`/resume/section/${prevStepId}`);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background pt-0 flex relative overflow-hidden">
                {/* Left Sidebar - Navigation */}
                <aside className="w-64 border-r border-border bg-primary hidden lg:block fixed h-screen left-0 top-0 overflow-y-auto z-10 print:hidden">
                    <div className="p-6 space-y-8">
                        {/* Saving Status Indicator */}
                        <div className="flex items-center gap-2 text-primary-foreground/70 text-xs font-medium">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Cloud className="w-3 h-3" />
                                    <span>{lastSaved ? "Saved" : "Ready"}</span>
                                </>
                            )}
                        </div>

                        {/* Resume Score Indicator */}
                        <ScoreIndicator score={score} tips={tips} className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground" />

                        <div className="space-y-2">
                            {steps.map((step, index) => {
                                const stepStatus =
                                    step.id === currentStepId ? "current" :
                                        index < currentStepIndex ? "completed" : "upcoming";

                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => autoSaveAndNavigate(`/resume/section/${step.id}`)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all",
                                            stepStatus === "current" && "bg-white text-primary font-medium shadow-sm",
                                            stepStatus === "completed" && "text-primary-foreground/90 hover:bg-primary-foreground/10",
                                            stepStatus === "upcoming" && "text-primary-foreground/50 hover:bg-primary-foreground/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                                            stepStatus === "current" && "border-primary bg-primary text-white",
                                            stepStatus === "completed" && "border-white/50 bg-white/20 text-white",
                                            stepStatus === "upcoming" && "border-white/20 text-white/50"
                                        )}>
                                            {stepStatus === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.order}
                                        </div>
                                        <span>{step.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area - Scrollable */}
                {/* Main Content Area - Scrollable */}
                <main className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    "lg:ml-64" // Sidebar offset - No margin push for preview (overlay)
                )}>
                    {/* Form Column - Takes full width */}
                    <div className="flex-1 p-6 md:p-12 pb-32 max-w-7xl mx-auto w-full">
                        <div className="pb-24">
                            {children}
                        </div>


                        {/* Floating Navigation Footer */}
                        <div className={cn(
                            "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 z-20 print:hidden transition-all duration-300",
                            "lg:left-64",
                            "lg:right-0" // Always full width (minus sidebar)
                        )}>
                            <div className="flex justify-between items-center max-w-4xl mx-auto">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={currentStepIndex === 0}
                                >
                                    Back
                                </Button>
                                <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                                    Step {currentStepOrder} of {steps.length}
                                </div>
                                <Button onClick={handleNext}>
                                    {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Preview Toggle Button (Floating) */}
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={cn(
                        "fixed top-6 z-50 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 print:hidden border",
                        showPreview
                            ? "bg-background text-foreground border-border right-[calc(50vw+1.5rem)]"
                            : "bg-primary text-primary-foreground border-primary right-6"
                    )}
                    title="Toggle Preview"
                >
                    {showPreview ? <ChevronRight className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>

                {/* Slide-over Preview Panel */}
                <div className={cn(
                    "fixed top-0 right-0 h-screen bg-zinc-50 border-l border-border shadow-2xl transition-transform duration-300 ease-in-out z-40 w-full md:w-[50vw]",
                    showPreview ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="h-full w-full relative flex flex-col">
                        {/* Header of Panel */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm">
                            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Live Preview</h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handlePrint()}
                                    size="sm"
                                    variant="outline"
                                    className="gap-2 h10 bg-primary text-primary-foreground"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Download PDF</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setShowPreview(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative bg-zinc-100/50">
                            <ResumePreview ref={resumePreviewRef} />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
