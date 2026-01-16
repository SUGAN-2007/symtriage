export default function About() {
  return (
    <main className="w-full bg-gray-50">
      {/* HERO */}
      <section className="w-full bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            About Triage
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
            Understanding how our AI-powered symtom triage system works — clearly,
            safely, and responsibly.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Input Validation",
                text:
                  "Inputs are strictly validated to ensure they are symptom-related. Non-health prompts are rejected to prevent misuse.",
              },
              {
                title: "AI Analysis",
                text:
                  "Natural language processing is used to understand symptom context and severity — not to diagnose.",
              },
              {
                title: "Urgency Classification",
                text:
                  "Symptoms are classified into Low, Medium, or High urgency to guide how quickly care should be sought.",
              },
              {
                title: "Department Recommendation",
                text:
                  "Based on urgency and symptoms, the system suggests an appropriate medical department.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#4a51bd]/10 text-[#4a51bd] font-semibold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            What Makes SymTriage Different
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Health-Only Focus",
                text:
                  "Input is restricted to symptom-related health concerns, unlike general-purpose chatbots.",
              },
              {
                title: "Urgency, Not Diagnosis",
                text:
                  "The system classifies urgency instead of diagnosing conditions, aligning with ethical AI practices.",
              },
              {
                title: "Privacy-Aware Design",
                text:
                  "No personal identity or free-form medical history is stored — only anonymized symptom patterns.",
              },
              {
                title: "Misuse Prevention",
                text:
                  "Strict validation and limited outputs reduce the risk of AI misuse in healthcare scenarios.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border-l-2 border-[#4a51bd]/70 pl-5 py-3"
              >
                <h3 className="font-medium text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIMITATIONS */}
      <section className="w-full bg-[#4a51bd]/10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Important Limitations
          </h2>

          <ul className="space-y-4 text-sm sm:text-base text-gray-600">
            <li>• This system does <strong>not</strong> diagnose diseases.</li>
            <li>• This system does <strong>not</strong> prescribe medication or treatment.</li>
            <li>• Outputs are informational, not medical decisions.</li>
            <li>
              • In emergencies, contact emergency services immediately — do not
              rely on this tool.
            </li>
          </ul>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="w-full bg-red-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Full Disclaimer
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            SymTriage is an AI-powered triage guidance tool intended for
            informational purposes only. It does not replace professional
            medical advice, diagnosis, or treatment. Always consult a qualified
            healthcare provider regarding medical concerns. If you believe you
            are experiencing a medical emergency, contact emergency services
            immediately.
          </p>
        </div>
      </section>
    </main>
  );
}
