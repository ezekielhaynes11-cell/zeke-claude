"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/scripts", label: "Scripts", icon: "✍️" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/performance", label: "Performance", icon: "📈" },
  { href: "/dead-letter", label: "Dead Letter", icon: "⚠️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[var(--brand-surface)] border-r border-[var(--brand-border)] min-h-screen">
      <div className="px-5 py-5 border-b border-[var(--brand-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-gold)] flex items-center justify-center">
            <span className="text-black font-bold text-sm">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Anointed</p>
            <p className="text-xs text-[var(--brand-muted)] mt-0.5">Traffic Engine</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[var(--brand-gold)] text-black font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--brand-border)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>🚪</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
