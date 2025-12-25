"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";

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
