"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateSummary } from "@/redux/features/resumeSlice";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function SummaryForm() {
    const dispatch = useDispatch<AppDispatch>();
    const summary = useSelector((state: RootState) => state.resume.summary);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 500) {
            dispatch(updateSummary(value));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pt-24 px-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Briefly describe yourself
                </h1>
                <p className="text-muted-foreground text-base">
                    What are your top achievements? What kind of role are you looking for?
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-3">
                    <Label htmlFor="summary" className="sr-only">Professional Summary</Label>
                    <Textarea
                        id="summary"
                        value={summary}
                        onChange={handleChange}
                        placeholder="e.g. Experienced Project Manager with over 5 years of experience in leading agile teams..."
                        className="min-h-[300px] text-base p-4 leading-relaxed resize-none bg-background border-2 border-border focus:border-primary transition-all duration-200"
                    />
                    <div className="flex justify-end">
                        <p className={cn("text-xs", summary.length >= 500 ? "text-destructive font-medium" : "text-muted-foreground")}>
                            {summary.length} / 500 characters
                        </p>
                    </div>
                </div>

                {/* Future Enhancement: AI Suggestions could go here */}
            </div>
        </div>
    );
}
