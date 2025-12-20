import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    photoUrl?: string;
}

export interface Experience {
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    location: string;
}

export interface Skill {
    id: string;
    name: string;
    level: string; // e.g., "Beginner", "Intermediate", "Advanced", "Expert"
}

interface ResumeState {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    summary: string;
    templateConfig: {
        id: string; // e.g., 'modern', 'minimal', 'professional'
        color: string; // Hex code for primary color
        font: string; // Font family class
    };
}

const initialState: ResumeState = {
    personalInfo: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
        photoUrl: "",
    },
    experience: [],
    education: [],
    skills: [],
    summary: "",
    templateConfig: {
        id: "modern",
        color: "#0f172a", // Slate-900 default
        font: "font-sans",
    },
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
        },
        addExperience: (state, action: PayloadAction<Experience>) => {
            state.experience.push(action.payload);
        },
        removeExperience: (state, action: PayloadAction<string>) => {
            state.experience = state.experience.filter(exp => exp.id !== action.payload);
        },
        updateExperience: (state, action: PayloadAction<Experience>) => {
            const index = state.experience.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) {
                state.experience[index] = action.payload;
            }
        },
        addEducation: (state, action: PayloadAction<Education>) => {
            state.education.push(action.payload);
        },
        removeEducation: (state, action: PayloadAction<string>) => {
            state.education = state.education.filter(edu => edu.id !== action.payload);
        },
        updateEducation: (state, action: PayloadAction<Education>) => {
            const index = state.education.findIndex(edu => edu.id === action.payload.id);
            if (index !== -1) {
                state.education[index] = action.payload;
            }
        },
        addSkill: (state, action: PayloadAction<Skill>) => {
            state.skills.push(action.payload);
        },
        removeSkill: (state, action: PayloadAction<string>) => {
            state.skills = state.skills.filter(skill => skill.id !== action.payload);
        },
        updateSkill: (state, action: PayloadAction<Skill>) => {
            const index = state.skills.findIndex(skill => skill.id === action.payload.id);
            if (index !== -1) {
                state.skills[index] = action.payload;
            }
        },
        updateSummary: (state, action: PayloadAction<string>) => {
            state.summary = action.payload;
        },
        updateTemplateConfig: (state, action: PayloadAction<Partial<ResumeState['templateConfig']>>) => {
            state.templateConfig = { ...state.templateConfig, ...action.payload };
        },
    },
});

export const {
    updatePersonalInfo,
    addExperience, removeExperience, updateExperience,
    addEducation, removeEducation, updateEducation,
    addSkill, removeSkill, updateSkill,
    updateSummary,
    updateTemplateConfig
} = resumeSlice.actions;
export default resumeSlice.reducer;
