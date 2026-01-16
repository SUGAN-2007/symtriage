import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function AnimatedButton({
  onClick,
  disabled,
  children,
  variant = "primary",
  className = "",
  loading = false,
}) {
  const prefersReduced = useReducedMotion();

  const baseClass =
    variant === "primary"
      ? "bg-[#4a51bd] text-white hover:bg-[#3a41ad]"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={
        !disabled && !loading && !prefersReduced
          ? { scale: 1.02 }
          : {}
      }
      whileTap={
        !disabled && !loading && !prefersReduced
          ? { scale: 0.98 }
          : {}
      }
      className={`px-8 py-2.5 rounded-xl font-medium transition-all duration-150 ${baseClass} ${className} ${
        disabled || loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <motion.div
          className="flex items-center gap-2"
          animate={
            prefersReduced
              ? {}
              : { opacity: [0.6, 1, 0.6] }
          }
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 1.5, repeat: Infinity }
          }
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.button>
  );
}
