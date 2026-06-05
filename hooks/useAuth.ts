import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

interface User {
  email: string;
  is_admin: boolean;
  [key: string]: unknown;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function useAuth(requireAdmin = false): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const tokenType =
      typeof window !== "undefined"
        ? localStorage.getItem("token_type") ?? "Bearer"
        : "Bearer";

    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `${tokenType} ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Auth failed");

      const userData: User = await res.json();

      if (requireAdmin && !userData.is_admin) {
        alert("Access denied. Admin privileges required.");
        router.push("/login");
        return;
      }

      setUser(userData);
    } catch {
      ["access_token", "token_type", "user"].forEach((k) =>
        localStorage.removeItem(k)
      );
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [requireAdmin, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    ["access_token", "token_type", "user"].forEach((k) =>
      localStorage.removeItem(k)
    );
    router.push("/login");
  }, [router]);

  return { user, loading, logout };
}
