"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, Dropdown, Label, Spinner } from "@heroui/react";
import {
  LayoutDashboard,
  PlusCircle,
  Upload,
  History,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { redirect } from "next/navigation";
import OnboardingTour from "@/components/OnboardingTour";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns/new", label: "New Campaign", icon: PlusCircle },
  { href: "/campaigns/upload", label: "Upload CSV", icon: Upload },
  { href: "/history", label: "History", icon: History },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (status === "unauthenticated") {
    redirect("/");
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-offwhite">
      {/* Desktop Header */}
      <header
        className="hidden h-16 items-center justify-between border-b px-4 w-full lg:flex"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="flex items-center gap-x-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--color-coral)" }}
          >
            <BarChart3 size={20} color="white" strokeWidth={1.5} />
          </div>

          <h1 className="font-jkt font-bold text-xl leading-none">AdVize</h1>
        </div>

        <nav className="nav-menu">
          <ul className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        pathname === item.href
                          ? "var(--color-coral-light)"
                          : "transparent",
                      color:
                        pathname === item.href
                          ? "var(--color-coral)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Dropdown>
          <Dropdown.Trigger>
            <Avatar className="cursor-pointer">
              <Avatar.Image
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? ""}
              />

              <Avatar.Fallback>{session?.user?.name}</Avatar.Fallback>
            </Avatar>
          </Dropdown.Trigger>

          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item
                key="logout"
                id={"logout"}
                textValue="Logout"
                variant="danger"
                onPress={() => signOut({ callbackUrl: "/" })}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <Label>Log Out</Label>
                  <LogOut className="text-danger" size={16} />
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </header>

      {/* Mobile Header */}
      <header
        className="flex h-16 items-center justify-between border-b px-4 w-full lg:hidden"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <button
          className="btn-icon nav-menu"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-x-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--color-coral)" }}
          >
            <BarChart3 size={16} color="white" strokeWidth={1.5} />
          </div>
          <h1 className="font-jkt font-bold text-lg leading-none">AdVize</h1>
        </div>

        <Dropdown>
          <Dropdown.Trigger>
            <Avatar size="sm" className="cursor-pointer">
              <Avatar.Image
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? ""}
              />
              <Avatar.Fallback>{session?.user?.name}</Avatar.Fallback>
            </Avatar>
          </Dropdown.Trigger>

          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item
                key="logout"
                id={"logout"}
                textValue="Logout"
                variant="danger"
                onPress={() => signOut({ callbackUrl: "/" })}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <Label>Log Out</Label>
                  <LogOut className="text-danger" size={16} />
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-x-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-coral)" }}
              >
                <BarChart3 size={16} color="white" strokeWidth={1.5} />
              </div>
              <h1 className="font-jkt font-bold text-lg leading-none">
                AdVize
              </h1>
            </div>
            <button
              className="btn-icon"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-medium transition-colors"
                      style={{
                        backgroundColor: isActive
                          ? "var(--color-coral-light)"
                          : "transparent",
                        color: isActive
                          ? "var(--color-coral)"
                          : "var(--color-text-secondary)",
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <OnboardingTour />
    </div>
  );
}
