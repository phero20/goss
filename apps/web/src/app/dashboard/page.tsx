import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div>
                dashboard page
            </div>
        </ProtectedRoute>
    );
}
