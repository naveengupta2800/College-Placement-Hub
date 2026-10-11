import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  User,
  Bell,
  Building2,
  Users,
  ClipboardList,
  CalendarDays,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = {
    student: [
      {
        label: "Dashboard",
        path: "/student/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Placement Drives",
        path: "/student/drives",
        icon: BriefcaseBusiness,
      },
      {
        label: "My Applications",
        path: "/student/applications",
        icon: FileText,
      },
      {
        label: "Placement Rounds",
        path: "/student/rounds",
        icon: CalendarDays,
      },
      {
        label: "My Profile",
        path: "/student/profile",
        icon: User,
      },
      {
        label: "Notifications",
        path: "/student/notifications",
        icon: Bell,
      },
    ],

    recruiter: [
      {
        label: "Dashboard",
        path: "/recruiter/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Company Profile",
        path: "/recruiter/company",
        icon: Building2,
      },
      {
        label: "My Drives",
        path: "/recruiter/drives",
        icon: BriefcaseBusiness,
      },
      {
        label: "Applicants",
        path: "/recruiter/applicants",
        icon: Users,
      },
      {
        label: "Placement Rounds",
        path: "/recruiter/rounds",
        icon: CalendarDays,
      },
      {
        label: "Notifications",
        path: "/recruiter/notifications",
        icon: Bell,
      },
    ],

    admin: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Companies",
        path: "/admin/companies",
        icon: Building2,
      },
      {
        label: "Placement Drives",
        path: "/admin/drives",
        icon: BriefcaseBusiness,
      },
      {
        label: "Students",
        path: "/admin/students",
        icon: Users,
      },
      {
        label: "Recruiters",
        path: "/admin/recruiters",
        icon: Users,
      },
      {
        label: "Applications",
        path: "/admin/applications",
        icon: ClipboardList,
      },
      {
        label: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
      },
    ],
  };

  const role = user?.role || "student";
  const items = menuItems[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-tight text-gray-900">
              PlacementHub
            </h1>

            <p className="text-xs text-gray-500">
              College Placement
            </p>
          </div>
        </div>
      </div>

      {/* User mini profile */}
      <div className="border-b border-gray-100 px-4 py-5">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>

            <p className="mt-0.5 truncate text-xs capitalize text-gray-500">
              {role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <div className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  group flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                  text-left text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.3 : 2}
                  className={
                    active
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {active && (
                  <ChevronRight
                    size={16}
                    className="text-blue-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut
            size={19}
            className="text-gray-400 transition group-hover:text-red-500"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;