"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Correct hook
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, LogIn, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loadUser, logout } from "@/redux/features/authSlice";

import { AuthModal } from "./AuthModal";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Redux Auth
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Load user on mount
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Look for scroll up or down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Hide on scroll down
            } else {
                setIsVisible(true);  // Show on scroll up
            }

            setScrolled(currentScrollY > 20);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleLogout = () => {
        dispatch(logout());
        setOpen(false); // Close mobile menu if open
    };

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Examples", href: "#examples" },
        { name: "Pricing", href: "#pricing" },
        
    ];

    // Helper to get initials
    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "fixed top-0 left-0 w-full z-50 border-b transition-colors duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
                    : "bg-transparent border-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 py-10 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Resume<span className="text-primary">SaaS</span>
                    </span>
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 pl-4 border-l border-border/50">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-9 w-9 border border-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <AuthModal
                                    trigger={
                                        <Button variant="ghost" size="default" className="gap-2">
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </Button>
                                    }
                                />
                                <AuthModal
                                    defaultTab="register"
                                    trigger={
                                        <Button size="lg" className="shadow-lg shadow-primary/20">
                                            Get Started
                                        </Button>
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                >
                    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-t border-border overflow-hidden"
                    >
                        <div className="px-6 py-6 space-y-4 flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-border my-4" />

                            {isAuthenticated && user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-2 py-3 bg-muted/30 rounded-lg">
                                        <Avatar className="h-10 w-10 border border-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                                        <Link href="/dashboard" onClick={() => setOpen(false)}>
                                            <User className="w-4 h-4" /> Dashboard
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4" /> Log out
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <AuthModal
                                        trigger={
                                            <Button variant="ghost" className="w-full justify-start gap-2">
                                                <LogIn className="w-4 h-4" />
                                                Login
                                            </Button>
                                        }
                                    />
                                    <AuthModal
                                        defaultTab="register"
                                        trigger={
                                            <Button className="w-full shadow-lg shadow-primary/20">
                                                Get Started
                                            </Button>
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}


