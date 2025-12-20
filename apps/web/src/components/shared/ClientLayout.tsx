"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBuilder = pathname.startsWith("/resume");

    return (
        <>
            {!isBuilder && <Navbar />}
            <div className={!isBuilder ? "pt-20" : ""}>
                {children}
            </div>
        </>
    );
}
