"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Storefront", href: "/" },
  { label: "Orders", href: "/orders" },
  { label: "Manage", href: "/manage" },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <div className="container-fluid py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 px-2 px-md-3">
            <div>
              <div className="fw-semibold text-uppercase small text-secondary-custom">next-storefront</div>
              <div className="h4 mb-0">Performance-first commerce</div>
            </div>
            <nav className="d-flex gap-2 flex-wrap">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`btn btn-sm border site-nav-link ${active ? "site-nav-link--active" : "bg-white text-dark"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
