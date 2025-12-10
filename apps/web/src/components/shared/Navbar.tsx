"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Correct hook
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Examples", href: "#examples" },
        { name: "Pricing", href: "#pricing" },
    ];

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
                        <Link href="/login">
                            <Button variant="ghost" size="default" className="gap-2">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="lg" className="shadow-lg shadow-primary/20">
                                Get Started
                            </Button>
                        </Link>
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
                            <Link href="/login" onClick={() => setOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register" onClick={() => setOpen(false)}>
                                <Button className="w-full shadow-lg shadow-primary/20">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}


