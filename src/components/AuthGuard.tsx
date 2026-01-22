"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "faculty" | "student";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = authUtils.getCurrentUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push("/login");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
