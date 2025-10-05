"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  name?: string;
}

export default function DashboardHeader({ name = "User" }: DashboardHeaderProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/subscriptions", label: "Subscriptions" },
    { href: "/calendar", label: "Calendar" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="flex justify-between items-center w-full mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Welcome, {name}!
        </h1>
        <p className="text-sm text-white/50">Here’s your current overview.</p>
      </div>

      <nav className="flex gap-4 text-sm">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-200 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
