import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function NotFound() {
  const prefersReduced = useReducedMotion();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="max-w-md w-full text-center bg-white/90 backdrop-blur-md
                   border border-gray-200 rounded-2xl shadow-lg p-8"
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-[#4a51bd]/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#4a51bd]">404</span>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back to a safe place.
        </p>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex items-center justify-center
                     px-6 py-3 rounded-lg
                     bg-[#4a51bd] text-white font-medium
                     hover:bg-[#3a41ad]
                     transition-colors shadow-md"
        >
          Return to Home
        </Link>

        {/* Subtle disclaimer */}
        <p className="mt-6 text-xs text-gray-400">
          SympTriage • AI-based symptom triage guidance
        </p>
      </motion.div>
    </main>
  );
}
