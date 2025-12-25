"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updatePersonalInfo, saveResume } from "@/redux/features/resumeSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Mail, Phone, MapPin, Globe, Linkedin, Github, Plus } from "lucide-react";
import Image from "next/image";
import { LocationAutocomplete } from "@/components/resume-builder/autocomplete/LocationAutocomplete";
import { JobTitleAutocomplete } from "@/components/resume-builder/autocomplete/JobTitleAutocomplete";
import { SkillsAutocomplete } from "@/components/resume-builder/autocomplete/SkillsAutocomplete";
import api from "@/lib/axios";
import axios from "axios";

export function PersonalForm() {
    const dispatch = useDispatch<AppDispatch>();
    const personalInfo = useSelector((state: RootState) => state.resume.personalInfo);

    const [formData, setFormData] = useState(personalInfo);
    const [showSocials, setShowSocials] = useState({
        linkedin: !!personalInfo.linkedin,
        github: !!personalInfo.github,
        website: !!personalInfo.website
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(personalInfo);
    }, [personalInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        dispatch(updatePersonalInfo({ [name]: value }));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Optimistic preview
            const tempUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, photoUrl: tempUrl }));

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                console.error("Cloudinary credentials missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
                alert("Cloudinary not configured!");
                return;
            }

            try {
                // Cloudinary Upload
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                const publicUrl = response.data.secure_url;

                // 3. Update State with real Public URL
                setFormData(prev => ({ ...prev, photoUrl: publicUrl }));
                dispatch(updatePersonalInfo({ photoUrl: publicUrl }));

                // Immediately save the resume to persist the photo URL link
                dispatch(saveResume());
            } catch (error) {
                console.error("Cloudinary upload failed", error);
                // Revert optimistic update if needed, or show error
                alert("Failed to upload image.");
            }
        }
    };

    const handlePhotoRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newData = { ...formData, photoUrl: "" };
        setFormData(newData);
        dispatch(updatePersonalInfo({ photoUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const toggleSocial = (key: keyof typeof showSocials) => {
        setShowSocials(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pt-24 px-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Let’s start with your header
                </h1>
                <p className="text-muted-foreground text-base">
                    Include your full name and contact details to help recruiters get in touch.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-16">
                {/* Photo Placeholder */}
                <div className="flex flex-col items-center pt-10 gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-48 h-48 rounded-xl bg-secondary/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden relative"
                    >
                        {formData.photoUrl ? (
                            <>
                                <Image
                                    src={formData.photoUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={handlePhotoRemove}
                                    className="absolute top-1 right-1 bg-background/80 hover:bg-destructive hover:text-white text-muted-foreground rounded-full p-1 transition-colors z-10 cursor-pointer"
                                    title="Remove photo"
                                >
                                    <Plus className="w-4 h-4 rotate-45" />
                                </button>
                            </>
                        ) : (
                            <User className="w-12 h-12 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary h-auto p-0 hover:bg-transparent hover:underline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {formData.photoUrl ? "Change Photo" : "Upload Photo"}
                    </Button>
                </div>

                {/* Main Inputs */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                            {/* Increased Input Size to h-14 */}
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="e.g. Md Feroz Ahmed"
                                className="h-14 bg-background text-base"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title</Label>
                            <JobTitleAutocomplete
                                id="jobTitle"
                                value={formData.jobTitle}
                                onChange={(val) => {
                                    const newData = { ...formData, jobTitle: val };
                                    setFormData(newData);
                                    dispatch(updatePersonalInfo({ jobTitle: val }));
                                }}
                                className="h-14 text-base"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                className="h-14 bg-background text-base"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9014040483"
                                className="h-14 bg-background text-base"
                            />
                        </div>
                    </div>




                    <div className="space-y-3">
                        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                        <LocationAutocomplete
                            id="location"
                            value={formData.location}
                            onChange={(val) => {
                                const newData = { ...formData, location: val };
                                setFormData(newData);
                                dispatch(updatePersonalInfo({ location: val }));
                            }}
                            placeholder="Hyderabad, India"
                            className="h-14 text-base"
                        />
                    </div>

                    {/* Additional Info / Socials */}
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">Add additional information</span>
                            <span className="text-xs text-muted-foreground">(optional)</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {!showSocials.linkedin && (
                                <Button variant="outline" size="sm" onClick={() => toggleSocial('linkedin')} className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                                    <Plus className="w-3.5 h-3.5" /> LinkedIn
                                </Button>
                            )}
                            {!showSocials.website && (
                                <Button variant="outline" size="sm" onClick={() => toggleSocial('website')} className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                                    <Plus className="w-3.5 h-3.5" /> Website
                                </Button>
                            )}
                            {!showSocials.github && (
                                <Button variant="outline" size="sm" onClick={() => toggleSocial('github')} className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                                    <Plus className="w-3.5 h-3.5" /> GitHub
                                </Button>
                            )}
                        </div>

                        {/* Social Links Grid Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {showSocials.linkedin && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="linkedin" className="text-sm font-medium  flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn Profile</Label>
                                        <Button variant="ghost" size="sm" onClick={() => toggleSocial('linkedin')} className="h-auto p-0 text-muted-foreground hover:text-destructive">Remove</Button>
                                    </div>
                                    <Input
                                        id="linkedin"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="linkedin.com/in/profile"
                                        className="h-14 text-base"
                                    />
                                </div>
                            )}
                            {showSocials.website && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="website" className="text-sm font-medium  flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-500" /> Personal Website</Label>
                                        <Button variant="ghost" size="sm" onClick={() => toggleSocial('website')} className="h-auto p-0 text-muted-foreground hover:text-destructive">Remove</Button>
                                    </div>
                                    <Input
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://portfolio.com"
                                        className="h-14 text-base"
                                    />
                                </div>
                            )}
                            {showSocials.github && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="github" className="text-sm font-medium  flex items-center gap-2"><Github className="w-4 h-4" /> GitHub Profile</Label>
                                        <Button variant="ghost" size="sm" onClick={() => toggleSocial('github')} className="h-auto p-0 text-muted-foreground hover:text-destructive">Remove</Button>
                                    </div>
                                    <Input
                                        id="github"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="github.com/username"
                                        className="h-14 text-base"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
