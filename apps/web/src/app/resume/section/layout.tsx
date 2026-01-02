"use client";

import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Cloud } from "lucide-react"; // Added Icons
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { saveResume, fetchResume } from "@/redux/features/resumeSlice";
import { useEffect, useMemo } from "react";
import { ScoreIndicator } from "@/components/resume-builder/ScoreIndicator";
import { calculateScore } from "@/lib/score";

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
            <div className="min-h-screen bg-background pt-0">
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
                                    <div
                                        key={step.id}
                                        onClick={() => autoSaveAndNavigate(`/resume/section/${step.id}`)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                                            stepStatus === "current"
                                                ? "bg-primary-foreground/10 text-primary-foreground font-medium"
                                                : "text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                                        )}
                                    >
                                        <div className="flex items-center justify-center">
                                            {stepStatus === "completed" ? (
                                                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                                            ) : (
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs",
                                                    stepStatus === "current"
                                                        ? "border-primary-foreground text-primary-foreground"
                                                        : "border-primary-foreground/60 text-primary-foreground/60"
                                                )}>
                                                    {step.order}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm">{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-8 border-t border-primary-foreground/20">
                            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-primary-foreground/80 font-semibold mb-2">
                                <span>Completeness</span>
                                <span>{Math.round(((currentStepOrder - 1) / (steps.length - 1)) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-foreground transition-all duration-300"
                                    style={{ width: `${Math.round(((currentStepOrder - 1) / (steps.length - 1)) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content - Form Area */}
                <main className="flex flex-col lg:ml-64 min-h-screen print:ml-0 print:min-h-0 pb-20 lg:pb-0">
                    <div className={cn(
                        "flex-1 flex flex-col items-center bg-muted/10 print:p-0 print:bg-white",
                        isFinalizeStep ? "justify-start" : "justify-center"
                    )}>
                        <div className="max-w-360 w-full mx-auto print:max-w-none print:w-full flex-1 flex flex-col">

                            {/* The Step Content */}
                            <div className="w-full flex-1 relative">
                                {children}
                            </div>

                            {/* Navigation Buttons (Bottom) */}
                            {!isFinalizeStep && (
                                <div className="flex justify-between mt-8 mb-12 px-5 md:px-12 border-t border-border/40 py-8 print:hidden">
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={currentStepIndex === 0}
                                        className="h-12 px-8"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {currentStepIndex === steps.length - 1 ? "Finish" : "Next: " + steps[currentStepIndex + 1].title}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Mobile Bottom Verification Progress */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t lg:hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3 mx-auto">
                            {steps.map((step, index) => {
                                const stepStatus =
                                    step.id === currentStepId ? "current" :
                                        index < currentStepIndex ? "completed" : "upcoming";

                                return (
                                    <div
                                        key={step.id}
                                        onClick={() => autoSaveAndNavigate(`/resume/section/${step.id}`)}
                                        className="relative flex items-center justify-center cursor-pointer"
                                    >
                                        {/* Connecting Line (except last item) */}
                                        {index < steps.length - 1 && (
                                            <div className={cn(
                                                "absolute left-full top-1/2 -translate-y-1/2 h-[2px] w-3 -mx-0.5 z-0",
                                                index < currentStepIndex ? "bg-primary" : "bg-muted"
                                            )} />
                                        )}

                                        {/* Circle Indicator */}
                                        <div className={cn(
                                            "relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                            stepStatus === "completed"
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : stepStatus === "current"
                                                    ? "bg-background border-primary text-primary shadow-[0_0_0_2px_rgba(var(--primary),0.2)]"
                                                    : "bg-muted/30 border-muted-foreground/30 text-muted-foreground"
                                        )}>
                                            {stepStatus === "completed" ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                                <span className="text-[10px] font-bold">{step.order}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
