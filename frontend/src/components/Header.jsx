import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      onClick={() => setOpen(false)}
      className={`relative text-sm font-medium transition-colors ${
        isActive(path)
          ? "text-[#4a51bd]"
          : "text-gray-600 hover:text-[#4a51bd]"
      }`}
    >
      {label}
      {isActive(path) && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#4a51bd] rounded" />
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition"
          >
            <img src="/icon.png" alt="SympTriage" className="h-8 w-8" />
            <span className="text-lg sm:text-xl font-semibold text-gray-900">
              SymTriage
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLink("/", "Home")}
            {navLink("/chat", "Chat")}
            {navLink("/about", "About")}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-4">
            {navLink("/", "Home")}
            {navLink("/chat", "Chat")}
            {navLink("/about", "About")}
          </div>
        </div>
      )}
    </header>
  );
}
