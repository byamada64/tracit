"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/config/navigation";
import { layoutTheme } from "@/config/theme";
import "./Sidebar.css";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sidebar"
      style={{
        "--sidebar-width": `${layoutTheme.sidebar.width}px`,
      }}
    >
      <div className="sidebar-header">
        <h1 className="sidebar-title">TracIT</h1>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {navigationItems.map((item) => {
            // Normalize pathname (remove trailing slash if present)
            const normalizedPath = pathname.replace(/\/$/, "") || "/";
            // Map root path to dashboard for active state
            const normalizedHref = item.href.replace(/\/$/, "") || "/";
            const isActive = 
              normalizedPath === normalizedHref || 
              (normalizedPath === "/" && normalizedHref === "/dashboard");
            return (
              <li key={item.href} className="sidebar-list-item">
                <Link
                  className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                  href={item.href}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
