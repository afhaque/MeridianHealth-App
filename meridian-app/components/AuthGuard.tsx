"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("auth") !== "true") {
      router.replace("/");
    }
  }, [router]);

  if (typeof window !== "undefined" && sessionStorage.getItem("auth") !== "true") {
    return null;
  }

  return <>{children}</>;
}
