import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "../components/AnimatedButton";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const prefersReduced = useReducedMotion();

  /* ------------------------------------------------------------------
     WARM UP EDGE FUNCTION (prevents first-request partial response)
  ------------------------------------------------------------------ */
  useEffect(() => {
    fetch(
      "https://lyqggxnqakznbsidbmef.supabase.co/functions/v1/triage"
    ).catch(() => {});
  }, []);

  /* ------------------------------------------------------------------
     ANIMATION VARIANTS
  ------------------------------------------------------------------ */
  const resultContainerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const shakeVariants = {
    shake: {
      x: prefersReduced ? [0] : [-4, 4, -4, 4, 0],
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  /* ------------------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------------------ */
  const sendMessage = async () => {
    if (!message.trim()) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(
        "https://lyqggxnqakznbsidbmef.supabase.co/functions/v1/triage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Service temporarily unavailable");
        return;
      }

      // HARD VALIDATION — prevents incomplete render on cold start
      if (
        !data ||
        !data.urgency ||
        !data.department ||
        !data.explanation
      ) {
        setError("Service is warming up. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetAssessment = () => {
    setMessage("");
    setResult(null);
    setError("");
  };

  const urgencyStyle = (urgency) => {
    const u = urgency?.toLowerCase();
    if (u === "low") return "bg-green-50 text-green-800 border-green-200";
    if (u === "medium") return "bg-yellow-50 text-yellow-800 border-yellow-200";
    if (u === "high") return "bg-red-50 text-red-800 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  return (
    <main className="w-full bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.header
          className="text-center mb-10"
          initial={prefersReduced ? false : { opacity: 0, y: -20 }}
          animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Symptom Assessment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe what you are experiencing to receive urgency guidance.
            This tool does not diagnose or treat medical conditions.
          </p>
        </motion.header>

        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your symptoms
          </label>

          <textarea
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#4a51bd] focus:border-transparent"
            placeholder="Example: I have leg pain and swelling for the last 2 days"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <p className="text-xs text-gray-400">
              Press Enter to submit • Shift + Enter for a new line
            </p>

            <AnimatedButton
              onClick={sendMessage}
              disabled={!message.trim()}
              loading={loading}
            >
              Get Assessment
            </AnimatedButton>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> This service is currently available in English only.
            </p>
          </div>
        </section>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <span className="text-sm text-gray-600 font-medium">
                  Analyzing your symptoms...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              variants={shakeVariants}
              animate="shake"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12"
              variants={resultContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Assessment Result
                </h2>
                <button
                  onClick={resetAssessment}
                  className="text-sm text-[#4a51bd] font-medium hover:underline"
                >
                  New assessment
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium pb-1 text-gray-700 mb-1">
                    Urgency Level
                  </p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full border text-sm font-semibold ${urgencyStyle(
                      result.urgency
                    )}`}
                  >
                    {result.urgency}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Recommended Department
                  </p>
                  <p className="text-gray-500 pl-2">{result.department}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Explanation
                  </p>
                  <p className="text-gray-500 pl-2 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Medical Attention
                  </p>
                  <p className="text-gray-500 pl-2 leading-relaxed">
                    {result.medical_attention}
                  </p>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">
                    {result.disclaimer}
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
