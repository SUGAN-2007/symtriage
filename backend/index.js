import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { symptomKeywords, bodyParts } from "./symptoms.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function isSymptomIntent(text) {
    if (!text) return false;

    const input = text.toLowerCase().trim();
    return symptomKeywords.some(w => input.includes(w)) ||
        bodyParts.some(b => input.includes(b) && input.includes("pain"));
}

app.post("/triage", async (req, res) => {
    const { message } = req.body;

    if (!message || !isSymptomIntent(message)) {
        return res.status(400).json({
            error: "This service is for symptom-related health concerns only.",
            disclaimer:
                "This information is not a medical diagnosis and does not replace professional medical advice."
        });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
        });

        const data = await response.json();
        const output = JSON.parse(data.choices[0].message.content);

        res.json(output);
    } catch (err) {
        res.status(500).json({ error: "Service unavailable" });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
