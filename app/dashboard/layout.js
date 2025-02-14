"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Providers } from "../providers";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
  };

  if (!session) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Horizontal Navbar */}
      <div className="w-full bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-white">HR Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Vertical Navigation Bar */}
        <div className="w-64 bg-gray-200 p-4">
          <nav>
            <ul className="space-y-2">
              <NavItem href="/dashboard" pathname={pathname}>
                Employees
              </NavItem>
              <NavItem href="/dashboard/manage-employees" pathname={pathname}>
                Manage Employees
              </NavItem>
              <NavItem href="/dashboard/leave-requests" pathname={pathname}>
                Leave Requests
              </NavItem>
            </ul>
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 bg-white shadow-md rounded-lg">{children}</div>
      </div>
    </div>
  );
}

// Reusable NavItem Component
function NavItem({ href, pathname, children }) {
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`block p-2 rounded transition ${
          isActive ? "bg-gray-700 text-white" : "text-gray-800 hover:bg-gray-300"
        }`}
      >
        <Providers>{children}</Providers>
      </Link>
    </li>
  );
}