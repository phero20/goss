import Image from "next/image";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div>
                dashboard page
            </div>
        </ProtectedRoute>
    );
}
