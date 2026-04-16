"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("deals");
    router.push("/");
  }

  const links = [
    { href: "/upload", label: "Upload" },
    { href: "/insights", label: "Insights" },
  ];

  return (
    <nav className="bg-[#00e5cc] px-6 py-4 flex items-center justify-between">
      <Link href="/upload" className="text-black font-bold text-lg tracking-tight">
        Meridian Health
      </Link>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              pathname === link.href
                ? "text-black underline underline-offset-4"
                : "text-black/70 hover:text-black"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-black/70 hover:text-black transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
