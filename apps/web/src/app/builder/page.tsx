"use client";

import { useState } from "react";
import { PersonalForm } from "@/components/resume-builder/PersonalForm";
import { ExperienceForm } from "@/components/resume-builder/ExperienceForm";
import { EducationForm } from "@/components/resume-builder/EducationForm";
import { SkillsForm } from "@/components/resume-builder/SkillsForm";
import { SummaryForm } from "@/components/resume-builder/SummaryForm";
import { FinalizeStep } from "@/components/resume-builder/FinalizeStep";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuilderPage() {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { id: 1, title: "Heading", status: currentStep === 1 ? "current" : currentStep > 1 ? "completed" : "upcoming" },
        { id: 2, title: "Work History", status: currentStep === 2 ? "current" : currentStep > 2 ? "completed" : "upcoming" },
        { id: 3, title: "Education", status: currentStep === 3 ? "current" : currentStep > 3 ? "completed" : "upcoming" },
        { id: 4, title: "Skills", status: currentStep === 4 ? "current" : currentStep > 4 ? "completed" : "upcoming" },
        { id: 5, title: "Summary", status: currentStep === 5 ? "current" : currentStep > 5 ? "completed" : "upcoming" },
        { id: 6, title: "Finalize", status: currentStep === 6 ? "current" : "upcoming" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background pt-0">
                {/* Left Sidebar - Navigation */}
                <aside className="w-64 border-r border-border bg-primary hidden lg:block fixed h-screen left-0 top-0 overflow-y-auto z-10 print:hidden">
                    <div className="p-6 space-y-8">
                        <div className="space-y-2">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                                        step.status === "current"
                                            ? "bg-primary-foreground/10 text-primary-foreground font-medium"
                                            : "text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                                    )}
                                >
                                    <div className="flex items-center justify-center">
                                        {step.status === "completed" ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                                        ) : (
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs",
                                                step.status === "current"
                                                    ? "border-primary-foreground text-primary-foreground"
                                                    : "border-primary-foreground/60 text-primary-foreground/60"
                                            )}>
                                                {step.id}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm">{step.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-primary-foreground/20">
                            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-primary-foreground/80 font-semibold mb-2">
                                <span>Completeness</span>
                                <span>{Math.round(((currentStep - 1) / steps.length) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-primary-foreground/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-foreground transition-all duration-300"
                                    style={{ width: `${Math.round(((currentStep - 1) / steps.length) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content - Form Area */}
                <main className="flex flex-col lg:ml-64 min-h-screen print:ml-0 print:min-h-0">
                    <div className="flex-1 p-5  pt-12 flex flex-col justify-center items-center bg-background/50 print:p-0 print:bg-white">
                        <div className="max-w-7xl w-full mx-auto print:max-w-none print:w-full">
                            {currentStep === 1 && <PersonalForm />}
                            {currentStep === 2 && <ExperienceForm />}
                            {currentStep === 3 && <EducationForm />}
                            {currentStep === 4 && <SkillsForm />}
                            {currentStep === 5 && <SummaryForm />}
                            {currentStep === 6 && <FinalizeStep />}

                            {/* Navigation Buttons (Hidden on Finalize step if you want, or just Hidden when printing) */}
                            {currentStep < 6 && (
                                <div className="flex justify-between mt-12 pt-8 border-t border-border/40 print:hidden">
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className="h-12 px-8"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {currentStep === steps.length ? "Finish" : "Next: " + steps[currentStep].title}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
