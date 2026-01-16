import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="w-full">
      {/* HERO */}
      <section className="w-full bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/icon.png"
              alt="SympTriage"
              className="h-20 w-20 sm:h-24 sm:w-24"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5">
            SymTriage
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            AI-based symptom urgency guidance
          </p>

          <p className="text-sm sm:text-base text-gray-500 max-w-3xl mx-auto mb-10">
            Get fast, reliable insight into how urgent your symtoms may be.
            SymTriage helps you decide when and where to seek medical care —
            without diagnosing or prescribing.
          </p>

          <Link
            to="/chat"
            className="inline-flex items-center justify-center bg-[#4a51bd] text-white px-10 py-3 rounded-xl font-medium shadow-md hover:bg-[#3a41ad] hover:shadow-lg transition"
          >
            Start Symptom Check
          </Link>
        </div>
      </section>
    <hr className="border-gray-200"/>
      {/* HOW IT WORKS */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Describe Symptoms",
                text:
                  "Enter your symptoms in natural language. Inputs are validated to ensure they are health-related.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                ),
              },
              {
                title: "AI Urgency Analysis",
                text:
                  "Our AI evaluates symptom context and severity using NLP — not diagnosis.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                  />
                ),
              },
              {
                title: "Get Guidance",
                text:
                  "Receive urgency level and department suggestions so you know what to do next.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center"
              >
                <div className="h-16 w-16 mx-auto mb-5 rounded-full bg-[#4a51bd]/10 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-[#4a51bd]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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

      {/* IMPORTANT NOTICE */}
      <section className="w-full bg-gray-300 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="bg-white border-l-2 border-[#4a51bd]/70 rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Important Notice
            </h3>

            <ul className="space-y-3 text-sm sm:text-base text-gray-600">
              <li>• This system does <strong>not</strong> diagnose diseases</li>
              <li>• This system does <strong>not</strong> prescribe treatment</li>
              <li>• Outputs are for <strong>triage guidance only</strong></li>
              <li>• Always consult a qualified healthcare professional</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
