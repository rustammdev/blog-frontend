import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useState } from "react";

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allLinks = [
    { url: "/login", name: "Login", isProtected: false },
    { url: "/register", name: "Register", isProtected: false },
    { url: "/post/create", name: "Create Post", isProtected: true },
    { url: "/myposts", name: "My Posts", isProtected: true },
  ];

  const filteredLinks = allLinks.filter((link) =>
    link.isProtected ? isAuthenticated : !isAuthenticated
  );

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Chap tomondagi elementlar (hamburger + logo) */}
        <div className="flex items-center">
          {/* Hamburger tugmasi (faqat mobilda) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none cursor-pointer"
          >
            <svg
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 18L20 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 12L20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 6L20 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Desktop menyu va user info */}
        <div className="hidden md:flex items-center gap-6">
          {/* Desktop navigatsiya linklari */}
          <div className="flex items-center gap-4">
            {filteredLinks.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  clsx(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                    {
                      "bg-gray-900 text-white": isActive,
                      "text-gray-300 hover:bg-gray-700 hover:text-white":
                        !isActive,
                    }
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop uchun user info va chiqish */}
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm whitespace-nowrap">
                Xush kelibsiz, foydalanuvchi!
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  window.location.reload();
                }}
                className="text-gray-300 hover:text-white  cursor-pointer text-sm px-3 py-1 font-bold rounded transition-colors whitespace-nowrap"
              >
                Chiqish
              </button>
            </div>
          )}
        </div>

        {/* Mobil menyu (faqat ochilganda ko'rinadi) */}
        {isMenuOpen && (
          <div className="absolute md:hidden top-16 left-0 right-0 bg-gray-800 p-4 space-y-2">
            {filteredLinks.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    {
                      "bg-gray-900 text-white": isActive,
                      "text-gray-300 hover:bg-gray-700 hover:text-white":
                        !isActive,
                    }
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-300 text-sm">
                    Xush kelibsiz, foydalanuvchi!
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      window.location.reload();
                    }}
                    className="text-gray-300 hover:text-white text-sm px-3 py-1 font-bold cursor-pointer rounded"
                  >
                    Chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
