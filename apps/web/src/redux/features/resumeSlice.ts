import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

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
    description?: string;
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
    isSaving: boolean;
    lastSaved: string | null;
    isDirty: boolean; // Tracks if there are unsaved changes
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
    isSaving: false,
    lastSaved: null,
    isDirty: false,
};

// Async Thunk for Saving Resume
export const saveResume = createAsyncThunk(
    'resume/save',
    async (_, { getState }) => {
        const state = getState() as { resume: ResumeState };
        const resumeData = state.resume;

        const payload = {
            data_json: JSON.stringify(resumeData),
            template_id: resumeData.templateConfig.id,
            is_public: false, // Default to private until published
            slug: "", // specific logic for slug can be handled later or if it exists in state
        };

        const response = await api.post('/resume', payload);
        return response.data;
    }
);

// Async Thunk for Fetching Resume
export const fetchResume = createAsyncThunk(
    'resume/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/resume');
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch resume");
        }
    }
);

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
            state.isDirty = true;
        },
        addExperience: (state, action: PayloadAction<Experience>) => {
            state.experience.push(action.payload);
            state.isDirty = true;
        },
        removeExperience: (state, action: PayloadAction<string>) => {
            state.experience = state.experience.filter(exp => exp.id !== action.payload);
            state.isDirty = true;
        },
        updateExperience: (state, action: PayloadAction<Experience>) => {
            const index = state.experience.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) {
                state.experience[index] = action.payload;
                state.isDirty = true;
            }
        },
        addEducation: (state, action: PayloadAction<Education>) => {
            state.education.push(action.payload);
            state.isDirty = true;
        },
        removeEducation: (state, action: PayloadAction<string>) => {
            state.education = state.education.filter(edu => edu.id !== action.payload);
            state.isDirty = true;
        },
        updateEducation: (state, action: PayloadAction<Education>) => {
            const index = state.education.findIndex(edu => edu.id === action.payload.id);
            if (index !== -1) {
                state.education[index] = action.payload;
                state.isDirty = true;
            }
        },
        addSkill: (state, action: PayloadAction<Skill>) => {
            state.skills.push(action.payload);
            state.isDirty = true;
        },
        removeSkill: (state, action: PayloadAction<string>) => {
            state.skills = state.skills.filter(skill => skill.id !== action.payload);
            state.isDirty = true;
        },
        updateSkill: (state, action: PayloadAction<Skill>) => {
            const index = state.skills.findIndex(skill => skill.id === action.payload.id);
            if (index !== -1) {
                state.skills[index] = action.payload;
                state.isDirty = true;
            }
        },
        updateSummary: (state, action: PayloadAction<string>) => {
            state.summary = action.payload;
            state.isDirty = true;
        },
        updateTemplateConfig: (state, action: PayloadAction<Partial<ResumeState['templateConfig']>>) => {
            state.templateConfig = { ...state.templateConfig, ...action.payload };
            state.isDirty = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Save Resume Handlers
            .addCase(saveResume.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(saveResume.fulfilled, (state) => {
                state.isSaving = false;
                state.lastSaved = new Date().toISOString();
                state.isDirty = false; // Reset dirty flag
            })
            .addCase(saveResume.rejected, (state) => {
                state.isSaving = false;
            })

            // Fetch Resume Handlers
            .addCase(fetchResume.fulfilled, (state, action) => {
                const fetchedData = action.payload;
                if (fetchedData && fetchedData.DataJSON) {
                    try {
                        const parsedData = JSON.parse(fetchedData.DataJSON);
                        // Merge parsed data into state
                        // We do a shallow merge for top-level keys to ensure structure
                        state.personalInfo = parsedData.personalInfo || state.personalInfo;
                        state.experience = parsedData.experience || state.experience;
                        state.education = parsedData.education || state.education;
                        state.skills = parsedData.skills || state.skills;
                        state.summary = parsedData.summary || state.summary;
                        state.templateConfig = parsedData.templateConfig || state.templateConfig;
                    } catch (e) {
                        console.error("Failed to parse resume data", e);
                    }
                }
            });
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
