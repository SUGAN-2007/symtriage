import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { symptomKeywords, bodyParts } from "./symptoms.js";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { data, error } = await supabase
    .from("triage_logs")
    .select("id")
    .limit(1);

console.log("DB TEST:", { data, error });

function isSymptomIntent(text) {
    if (!text) return false;

    const input = text.toLowerCase().trim();
    return (
        symptomKeywords.some(w => input.includes(w)) ||
        bodyParts.some(b => input.includes(b) && input.includes("pain"))
    );
}

/* ---------------- SIMPLE SYMPTOM EXTRACTION ---------------- */
function extractSymptoms(text) {
    const input = text.toLowerCase();
    return symptomKeywords.filter(word => input.includes(word));
}

/* ---------------- TRIAGE ENDPOINT ---------------- */
app.post("/triage", async (req, res) => {
    const { message } = req.body;

    /* ---- INTENT BLOCK ---- */
    if (!message || !isSymptomIntent(message)) {
        // Log blocked attempt (anonymized)
        await supabase.from("triage_logs").insert({
            symptoms: [],
            urgency: "Low",
            department: "N/A",
            intent_valid: false
        });

        return res.status(400).json({
            error: "This service is for symptom-related health concerns only.",
            disclaimer:
                "This information is not a medical diagnosis and does not replace professional medical advice."
        });
    }

    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `
You are a clinical triage assistant.
Rules:
- Only assess symptom urgency (Low, Medium, High)
- Recommend a medical department
- Do NOT diagnose diseases
- Do NOT give treatment or medication advice
- Always include a medical disclaimer
Respond ONLY in JSON with keys:
urgency, department, explanation, medical_attention, disclaimer
              `
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        let output;
        try {
            output = JSON.parse(data.choices[0].message.content);
        } catch {
            return res.status(500).json({
                error: "Invalid response format from AI service"
            });
        }

        /* ---- LOG SUCCESSFUL TRIAGE (ANONYMIZED) ---- */
        await supabase.from("triage_logs").insert({
            symptoms: extractSymptoms(message),
            urgency: output.urgency,
            department: output.department,
            intent_valid: true
        });

        res.json(output);
    } catch (err) {
        res.status(500).json({ error: "Service unavailable" });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
