"use client";

import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Cloud, Eye, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { saveResume, fetchResume } from "@/redux/features/resumeSlice";
import { useEffect, useMemo, useState } from "react";
import { ScoreIndicator } from "@/components/resume-builder/ScoreIndicator";
import { calculateScore } from "@/lib/score";
import { ResumePreview } from "@/components/resume-builder/preview/ResumePreview";

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

    // Preview Toggle State - Default false (closed)
    const [showPreview, setShowPreview] = useState(false);

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
                {/* We shift the main content area when preview is open on Large screens to avoid overlap if desired, 
                    OR we just let the preview overlay. 
                    Given "slides that preview", an overlay is standard. 
                    Let's just use standard overlay logic for consistent behavior. 
                */}
                <main className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    "lg:ml-64", // Sidebar offset
                    showPreview ? "lg:mr-[40vw] xl:mr-[30vw]" : "" // Optional: Push content on very large screens so you can see both?
                    // Let's TRY pushing it. If user dislikes, we can just overlay.
                    // User said "ui breaks", possibly because of flex squeezing.
                    // Pushing margin-right ensures no squeeze, just scroll.
                )}>
                    {/* Form Column - Takes full width */}
                    <div className="flex-1 p-6 md:p-12 pb-32 max-w-4xl mx-auto w-full">
                        <div className="pb-24">
                            {children}
                        </div>
                       

                        {/* Floating Navigation Footer */}
                        <div className={cn(
                            "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 z-20 print:hidden transition-all duration-300",
                            "lg:left-64",
                            showPreview ? "lg:right-[40vw] xl:right-[30vw]" : "lg:right-0" // Sync footer width with content
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
                            ? "bg-background text-foreground border-border right-[calc(100%-4rem)] md:right-[calc(40vw+1.5rem)] xl:right-[calc(30vw+1.5rem)]"
                            // When open: Position it near the preview edge or keep it fixed?
                            // Let's keep it fixed right for easy toggle, or inside the panel.
                            // Better UX: Keep it fixed Right, but shift it so it's not covered? 
                            // Actually, let's put it on the panel itself or just keep it simple fixed right.
                            // If simple fixed right, the panel covers it. 
                            // Let's make the Z-index of button higher than panel? No, panel takes focus.
                            // Let's move button to the left of the panel when open.
                            : "bg-primary text-primary-foreground border-primary right-6"
                    )}
                    style={showPreview ? { right: 'auto', left: 'auto', transform: 'translateX(-120%)' } : {}}
                // Actually, easiest is just a toggle button that stays visible or moves with panel.
                // Let's try placing it fixed right, but with high Z-index so it floats above panel? 
                // Or simply inside the panel header?
                >
                    {showPreview ? <ChevronRight className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>

                {/* Slide-over Preview Panel */}
                <div className={cn(
                    "fixed top-0 right-0 h-screen bg-zinc-50 border-l border-border shadow-2xl transition-transform duration-300 ease-in-out z-40 w-full md:w-[40vw] xl:w-[30vw]",
                    showPreview ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="h-full w-full relative flex flex-col">
                        {/* Header of Panel */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm">
                            <h2 className="font-semibold">Live Preview</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPreview(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative">
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
