"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loginUser, registerUser } from "@/redux/features/authSlice";

interface AuthModalProps {
    trigger?: React.ReactNode;
    defaultTab?: "login" | "register";
}

export function AuthModal({ trigger, defaultTab = "login" }: AuthModalProps) {
    const [tab, setTab] = useState<"login" | "register">(defaultTab);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            setIsOpen(false);
            router.push("/dashboard");
        }
    };

    const handleRegister = async () => {
        const result = await dispatch(registerUser({ name, email, password }));
        if (registerUser.fulfilled.match(result)) {
            setIsOpen(false);
            router.push("/dashboard");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Login</Button>}
            </DialogTrigger>
            <AnimatePresence>
                {isOpen && (
                    <DialogPrimitive.Portal forceMount>
                        {/* Overlay */}
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            />
                        </DialogPrimitive.Overlay>

                        {/* Content */}
                        <DialogPrimitive.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                                exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                className="fixed left-[50%] top-[50%] z-50 grid w-[90%] sm:w-full max-w-md gap-4 p-0 rounded-lg border border-white/10 shadow-2xl bg-background/90 backdrop-blur-xl overflow-hidden"
                            >
                                {/* Animated Header */}
                                <div className="relative overflow-hidden bg-linear-to-br from-primary/20 via-primary/5 to-transparent p-8 pb-6 text-center">
                                    <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] mask-[linear-gradient(to_bottom,transparent,black)]"></div>
                                    <DialogHeader className="relative z-10">
                                        <DialogTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 inline-block mb-2">
                                            {tab === "login" ? "Welcome Back" : "Create Account"}
                                        </DialogTitle>
                                        <DialogDescription className="text-base text-muted-foreground/80">
                                            {tab === "login" ? "Enter your credentials to access your account" : "Join us to build your perfect resume"}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogPrimitive.Close className="cursor-pointer absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </DialogPrimitive.Close>
                                </div>

                                {/* Custom Tabs */}
                                <div className="p-6 pt-2">
                                    <div className="flex p-1 bg-muted/50 rounded-lg mb-6 relative">
                                        <div className="absolute inset-0 bg-background/50 rounded-lg shadow-inner pointer-events-none"></div>
                                        {["login", "register"].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTab(t as "login" | "register")}
                                                className={cn(
                                                    "cursor-pointer flex-1 relative py-2 text-sm font-medium transition-all duration-300 rounded-md z-10",
                                                    tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {tab === t && (
                                                    <motion.div
                                                        layoutId="active-tab"
                                                        className="absolute inset-0 bg-primary rounded-md shadow-md"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <span className="relative z-10 capitalize">{t}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={tab}
                                            initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: tab === "login" ? 20 : -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4"
                                        >
                                            {error && (
                                                <div className="p-3 text-sm text-center text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                                                    {error}
                                                </div>
                                            )}

                                            {tab === "login" ? (
                                                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider ml-1">Email</Label>
                                                        <div className="relative group mt-2">
                                                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="hello@example.com"
                                                                className="pl-10"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mt-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="password" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider ml-1">Password</Label>
                                                            <Button variant="link" className="p-0 h-auto text-xs text-primary/80 hover:text-primary">Forgot?</Button>
                                                        </div>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                            <Input
                                                                id="password"
                                                                type="password"
                                                                className="pl-10"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="w-full h-11 mt-4 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                                        disabled={loading}
                                                    >
                                                        <LogIn className="w-4 h-4 mr-2" />
                                                        {loading ? "Logging in..." : "Login"}
                                                    </Button>
                                                </form>
                                            ) : (
                                                <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider ml-1">Full Name</Label>
                                                        <div className="relative group mt-2">
                                                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                            <Input
                                                                id="name"
                                                                placeholder="John Doe"
                                                                className="pl-10"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="reg-email" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider ml-1">Email</Label>
                                                        <div className="relative group mt-2">
                                                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                            <Input
                                                                id="reg-email"
                                                                type="email"
                                                                placeholder="hello@example.com"
                                                                className="pl-10"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="reg-password" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider ml-1">Password</Label>
                                                        <div className="relative group mt-2">
                                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                            <Input
                                                                id="reg-password"
                                                                type="password"
                                                                className="pl-10"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="w-full h-11 mt-4 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                                        disabled={loading}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        {loading ? "Creating Account..." : "Create Account"}
                                                    </Button>
                                                </form>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </Dialog>
    );
}
