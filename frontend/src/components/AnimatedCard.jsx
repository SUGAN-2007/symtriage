import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function AnimatedCard({ children, index = 0, className = "" }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-8 ${className}`}
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : {
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }
      }
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}
