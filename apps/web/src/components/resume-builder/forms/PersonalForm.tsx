"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updatePersonalInfo, saveResume } from "@/redux/features/resumeSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Phone, Linkedin, Globe, Github, Plus, Trash2, Camera, MapPin } from "lucide-react";
import Image from "next/image";
import { LocationAutocomplete } from "@/components/resume-builder/autocomplete/LocationAutocomplete";
import { JobTitleAutocomplete } from "@/components/resume-builder/autocomplete/JobTitleAutocomplete";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PersonalForm() {
    const dispatch = useDispatch<AppDispatch>();
    const personalInfo = useSelector((state: RootState) => state.resume.personalInfo);

    const [formData, setFormData] = useState(personalInfo);
    const [activeSocials, setActiveSocials] = useState({
        linkedin: !!personalInfo.linkedin,
        github: !!personalInfo.github,
        website: !!personalInfo.website
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(personalInfo);

        // Sync active states: keep existing ones active, or activate if data exists
        setActiveSocials(prev => ({
            linkedin: prev.linkedin || !!personalInfo.linkedin,
            github: prev.github || !!personalInfo.github,
            website: prev.website || !!personalInfo.website
        }));
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
                console.error("Cloudinary credentials missing");
                alert("Cloudinary not configured!");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                const publicUrl = response.data.secure_url;
                setFormData(prev => ({ ...prev, photoUrl: publicUrl }));
                dispatch(updatePersonalInfo({ photoUrl: publicUrl }));
                dispatch(saveResume());
            } catch (error) {
                console.error("Cloudinary upload failed", error);
                alert("Failed to upload image.");
            }
        }
    };

    const handlePhotoRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, photoUrl: "" }));
        dispatch(updatePersonalInfo({ photoUrl: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const toggleSocial = (key: keyof typeof activeSocials) => {
        const isActive = activeSocials[key];

        if (isActive) {
            // Removing: Clear data and hide
            const newData = { ...formData, [key]: "" };
            setFormData(newData);
            dispatch(updatePersonalInfo({ [key]: "" }));
            setActiveSocials(prev => ({ ...prev, [key]: false }));
        } else {
            // Adding: Just show
            setActiveSocials(prev => ({ ...prev, [key]: true }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto py-10 px-4"
        >
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Personal Details</h1>
                <p className="text-muted-foreground">Start with the basics. Recruiters look for this first.</p>
            </div>

            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                        {/* Left Column: Photo Upload */}
                        <div className="flex flex-col items-center space-y-4 md:w-1/4">
                            <div className="relative group">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "w-36 h-36 rounded-full border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:border-primary/20",
                                        formData.photoUrl ? "bg-background" : "bg-secondary/30"
                                    )}
                                >
                                    {formData.photoUrl ? (
                                        <Image
                                            src={formData.photoUrl}
                                            alt="Profile"
                                            width={144}
                                            height={144}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-muted-foreground/30" />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                                        <Camera className="w-8 h-8 text-white mb-1" />
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-white">Upload</span>
                                    </div>
                                </div>

                                {formData.photoUrl && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                                        onClick={handlePhotoRemove}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground font-medium">Profile Photo</p>
                                <p className="text-[10px] text-muted-foreground/60">Recommend 400x400px</p>
                            </div>
                        </div>

                        {/* Right Column: Inputs */}
                        <div className="flex-1 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g. Alex Morgan"
                                        className="h-11 bg-background/50 focus:bg-background transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jobTitle">Job Title</Label>
                                    <JobTitleAutocomplete
                                        id="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={(val) => {
                                            const newData = { ...formData, jobTitle: val };
                                            setFormData(newData);
                                            dispatch(updatePersonalInfo({ jobTitle: val }));
                                        }}
                                        className="h-11 bg-background/50 focus:bg-background transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="alex@example.com"
                                            className="h-11 pl-9 bg-background/50 focus:bg-background transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="h-11 pl-9 bg-background/50 focus:bg-background transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50 z-10" />
                                    <LocationAutocomplete
                                        id="location"
                                        value={formData.location}
                                        onChange={(val) => {
                                            const newData = { ...formData, location: val };
                                            setFormData(newData);
                                            dispatch(updatePersonalInfo({ location: val }));
                                        }}
                                        placeholder="City, Country"
                                        className="h-11 pl-9 bg-background/50 focus:bg-background transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Divider & Socials */}
                            <div className="pt-4 border-t border-border/40">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-foreground/80">Social Links</span>
                                    {/* Add Buttons */}
                                    <div className="flex gap-2">
                                        {!activeSocials.linkedin && (
                                            <Button variant="outline" size="sm" onClick={() => toggleSocial('linkedin')} className="h-8 gap-1.5 text-xs rounded-full hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                <Linkedin className="w-3.5 h-3.5" /> Add LinkedIn
                                            </Button>
                                        )}
                                        {!activeSocials.github && (
                                            <Button variant="outline" size="sm" onClick={() => toggleSocial('github')} className="h-8 gap-1.5 text-xs rounded-full hover:border-zinc-500/50 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50">
                                                <Github className="w-3.5 h-3.5" /> Add GitHub
                                            </Button>
                                        )}
                                        {!activeSocials.website && (
                                            <Button variant="outline" size="sm" onClick={() => toggleSocial('website')} className="h-8 gap-1.5 text-xs rounded-full hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                                                <Globe className="w-3.5 h-3.5" /> Add Website
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <AnimatePresence>
                                        {activeSocials.linkedin && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="relative"
                                            >
                                                <div className="absolute left-3 top-3.5 pointer-events-none">
                                                    <Linkedin className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <Input
                                                    name="linkedin"
                                                    value={formData.linkedin}
                                                    onChange={handleChange}
                                                    placeholder="LinkedIn URL"
                                                    className="h-11 pl-9 pr-10 bg-background/50 focus:bg-background transition-colors"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-destructive"
                                                    onClick={() => toggleSocial('linkedin')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        )}
                                        {activeSocials.github && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="relative"
                                            >
                                                <div className="absolute left-3 top-3.5 pointer-events-none">
                                                    <Github className="w-4 h-4 text-foreground/80" />
                                                </div>
                                                <Input
                                                    name="github"
                                                    value={formData.github}
                                                    onChange={handleChange}
                                                    placeholder="GitHub URL"
                                                    className="h-11 pl-9 pr-10 bg-background/50 focus:bg-background transition-colors"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-destructive"
                                                    onClick={() => toggleSocial('github')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        )}
                                        {activeSocials.website && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="relative"
                                            >
                                                <div className="absolute left-3 top-3.5 pointer-events-none">
                                                    <Globe className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <Input
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    placeholder="Portfolio / Website URL"
                                                    className="h-11 pl-9 pr-10 bg-background/50 focus:bg-background transition-colors"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-destructive"
                                                    onClick={() => toggleSocial('website')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
