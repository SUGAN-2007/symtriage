import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("https://symtriage.onrender.com/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) setError(data.error || "An error occurred");
      else setResult(data);
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
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Symtom Assessment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe what you are experiencing to receive urgency guidance.
            This tool does not diagnose or treat medical conditions.
          </p>
        </header>

        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your symtoms
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

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="bg-[#4a51bd] text-white px-8 py-2.5 rounded-xl font-medium hover:bg-[#3a41ad] transition disabled:bg-gray-300"
            >
              {loading ? "Analyzing..." : "Get Assessment"}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
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
                <p className="text-sm font-medium text-gray-700 mb-1">
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
                <p className="text-gray-900">{result.department}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Explanation
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Medical Attention
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {result.medical_attention}
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
                <p className="text-xs text-gray-600">
                  {result.disclaimer}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Footer Disclaimer */}
        {!result && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <strong>Medical Disclaimer:</strong> This tool provides triage guidance only.
            It does not replace professional medical advice. In emergencies, contact
            emergency services immediately.
          </div>
        )}
      </div>
    </main>
  );
}
