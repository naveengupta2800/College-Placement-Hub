import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({
  title = "Dashboard",
  description = "",
}) => {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      
      {/* Left Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="relative w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-gray-200
              bg-gray-50
              pl-10
              pr-4
              text-sm
              text-gray-700
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-blue-400
              focus:bg-white
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        {/* Notification */}
        <button
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
        >
          <Bell size={20} />

          {/* Notification Badge */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() =>
              setProfileOpen((prev) => !prev)
            }
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div className="text-left">
              <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs capitalize text-gray-500">
                {user?.role || "User"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`
                text-gray-400
                transition-transform
                ${profileOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              <button
                className="
                  mt-1
                  w-full
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-gray-600
                  transition
                  hover:bg-gray-50
                  hover:text-gray-900
                "
              >
                My Profile
              </button>

              <button
                className="
                  w-full
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-gray-600
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;