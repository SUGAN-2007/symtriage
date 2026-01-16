import { useState } from "react";

export default function App() {
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // new state

    const sendMessage = async () => {
        setError("");
        setResult(null);
        setLoading(true); // start loading

        try {
            const res = await fetch("http://localhost:5000/triage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch {
            setError("Unable to connect to server.");
        } finally {
            setLoading(false); // stop loading
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "Arial" }}>
            <h2>Symptom Checker</h2>

            <p style={{ fontSize: 14 }}>
                Enter symptoms you are experiencing. This tool does not provide
                diagnoses or treatment.
            </p>

            <textarea
                rows={4}
                style={{ width: "100%" }}
                placeholder="e.g. I have fever and headache"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // prevent newline
                        sendMessage();
                    }
                }}
            />

            <button onClick={sendMessage} style={{ marginTop: 10 }} disabled={loading}>
                {loading ? "⏳ Waiting for AI..." : "Get Assessment"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && (
                <div style={{ marginTop: 20 }}>
                    <p><b>Urgency:</b> {result.urgency}</p>
                    <p><b>Department:</b> {result.department}</p>
                    <p><b>Explanation:</b> {result.explanation}</p>
                    <p><b>Medical Attention:</b> {result.medical_attention}</p>
                    <p style={{ fontSize: 12, marginTop: 10 }}>
                        {result.disclaimer}
                    </p>
                </div>
            )}
        </div>
    );
}
