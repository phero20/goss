
export interface ResumeState {
    personalInfo: {
        fullName?: string;
        jobTitle?: string;
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        website?: string;
        photoUrl?: string; // We give points for photo
    };
    experience: any[]; // defining loosely for now, checking length and description
    education: any[];
    skills: any[];
    summary?: string;
}

export interface ScoreResult {
    score: number;
    tips: string[];
    categoryScores: {
        personal: number;
        experience: number;
        education: number;
        skills: number;
        summary: number;
    };
}

export function calculateScore(data: ResumeState): ScoreResult {
    let score = 0;
    let tips: string[] = [];
    const breakdown = {
        personal: 0,
        experience: 0,
        education: 0,
        skills: 0,
        summary: 0,
    };

    // -----------------------------------------
    // 1. Personal Info (Max 15 pts)
    // -----------------------------------------
    if (data.personalInfo.fullName && data.personalInfo.jobTitle) {
        breakdown.personal += 5;
    } else {
        tips.push("Add your Full Name and Job Title.");
    }

    if (data.personalInfo.email && (data.personalInfo.phone || data.personalInfo.location)) {
        breakdown.personal += 5;
    } else {
        tips.push("Add Email and Phone/Location for contact.");
    }

    if (data.personalInfo.linkedin || data.personalInfo.website || data.personalInfo.photoUrl) {
        breakdown.personal += 5;
    } else {
        tips.push("Add a professional photo or social link (LinkedIn/Portfolio).");
    }

    // -----------------------------------------
    // 2. Experience (Max 40 pts)
    // -----------------------------------------
    if (data.experience && data.experience.length > 0) {
        breakdown.experience += 15; // Base points for having experience

        if (data.experience.length >= 2) {
            breakdown.experience += 10; // History bonus
        } else {
            tips.push("Adding a second job role shows career progression.");
        }

        // Quality Check
        const avgLength = data.experience.reduce((acc, job) => acc + (job.description?.length || 0), 0) / data.experience.length;
        if (avgLength > 150) {
            breakdown.experience += 15;
        } else if (avgLength > 50) {
            breakdown.experience += 8;
            tips.push("Expand your job descriptions with more details (achievements, metrics).");
        } else {
            tips.push("Your job descriptions are too short. Describe your responsibilities.");
        }
    } else {
        tips.push("Add your work experience. This is crucial.");
    }

    // -----------------------------------------
    // 3. Education (Max 20 pts)
    // -----------------------------------------
    if (data.education && data.education.length > 0) {
        breakdown.education += 15;
        // Check if any has a degree
        // Assuming simple check for now
        if (data.education.length > 1 || (data.education[0]?.degree && data.education[0]?.degree.length > 2)) {
            breakdown.education += 5;
        }
    } else {
        tips.push("Add your educational background.");
    }

    // -----------------------------------------
    // 4. Skills (Max 15 pts)
    // -----------------------------------------
    if (data.skills && data.skills.length > 0) {
        breakdown.skills += 5;
        if (data.skills.length >= 5) {
            breakdown.skills += 10;
        } else {
            tips.push("Add at least 5 key skills to match job descriptions.");
        }
    } else {
        tips.push("List your technical and soft skills.");
    }

    // -----------------------------------------
    // 5. Summary (Max 10 pts)
    // -----------------------------------------
    if (data.summary && data.summary.length > 20) {
        breakdown.summary += 5;
        if (data.summary.length > 100) {
            breakdown.summary += 5;
        } else {
            tips.push("Make your summary longer (100+ chars) to pitch yourself effectively.");
        }
    } else {
        tips.push("Write a brief professional summary.");
    }

    // Calculate Total
    score = breakdown.personal + breakdown.experience + breakdown.education + breakdown.skills + breakdown.summary;

    // Cap at 100 just in case
    score = Math.min(score, 100);

    return {
        score,
        tips: tips.slice(0, 3), // Return max 3 meaningful tips
        categoryScores: breakdown
    };
}
