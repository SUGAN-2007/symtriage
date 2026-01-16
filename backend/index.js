import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Checks whether user input is symptom-related
 * Uses controlled keywords to avoid misuse
 */
function isSymptomIntent(text) {
    if (!text) return false;

    const input = text.toLowerCase().trim();
    const symptomKeywords = [
        // General / common
        "fever", "high temperature", "chills", "sweating", "fatigue", "weakness", "cold", "malaise", "Puffy", "swollen tongue",
        "headache", "dizziness", "confusion", "memory problems", "blurred vision", "vision problems", "hunger", "thirst",

        // Gastrointestinal
        "nausea", "vomit", "vomiting", "throwing up", "diarrhea", "constipation", "abdominal pain", "bloating",
        "heartburn", "loss of appetite", "weight loss", "weight gain", "pain during urination", "dehydration",

        // Respiratory
        "cough", "shortness of breath", "breathlessness", "difficulty breathing", "chest pain", "chest tightness",
        "runny nose", "stuffy nose", "nasal congestion", "sore throat", "throat irritation",

        // Musculoskeletal / pain
        "joint pain", "muscle pain", "back pain", "arm pain", "leg pain", "body aches",

        // Skin / external
        "skin rash", "itching", "dry skin", "swelling", "pimple", "inflection", "acne", "breakout", "eye redness", "eye pain", "fungus",

        // Neurological / psychiatric
        "tremors", "fainting", "numbness", "tingling", "pins and needles", "insomnia", "excessive sleepiness",
        "anxiety", "depression", "irritability",

        // Cardiovascular / heart
        "palpitations", "rapid heartbeat", "heart racing", "high blood pressure", "low blood pressure", "heart rate", "heart attack",

        // Urinary / reproductive
        "frequent urination", "painful urination", "blood in urine", "penis pain", "vaginal bleeding", "menstrual bleeding",

        // Bleeding / emergency
        "bleeding", "blood in stool", "blood in vomit", "nosebleed", "coughing blood", "hemorrhage",

        // Other serious / warning signs
        "chest tightness", "severe headache", "difficulty speaking", "slurred speech", "facial drooping",
        "shortness of breath at rest", "swelling of face or lips", "confusion", "loss of consciousness"
    ];

    const bodyParts = ["Head", "Brain", "Eyes", "Ears", "Nose", "Mouth", "Teeth", "Tongue",
        "Throat", "Neck", "Shoulders", "Arms", "Elbows", "Wrists", "Hands", "Fingers", "Chest", "Heart", "Lungs",
        "Ribs", "Back", "Spine", "Abdomen", "Stomach", "Liver", "Kidneys", "Pancreas", "Intestines", "Small intestine",
        "Large intestine", "Bladder", "Gallbladder", "Spleen", "Appendix", "Esophagus", "Trachea", "Diaphragm", "Pelvis",
        "Genitals", "Prostate", "Ovaries", "Uterus", "Testes", "Buttocks", "Hips", "Legs", "Thighs", "Knees", "Calves", "Ankles", "Feet",
        "Toes", "Skin", "Muscles", "Tendons", "Ligaments", "Joints", "Blood vessels", "Arteries", "Veins",
        "Lymph nodes", "Nerves", "Bones", "Bone marrow"];


    // Match symptoms directly OR body-part + pain
    return (
        symptomKeywords.some(w => input.includes(w)) ||
        bodyParts.some(b => input.includes(b) && input.includes("pain"))
    );
}

app.post("/triage", async (req, res) => {
    const { message } = req.body;

    // Intent gate
    if (!message || !isSymptomIntent(message)) {
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
                    model: "xiaomi/mimo-v2-flash:free",
                    messages: [
                        {
                            role: "system",
                            content: `
You are a clinical triage assistant.

Rules:
- Classify urgency as Low, Medium, or High
- Recommend an appropriate medical department
- Do NOT diagnose diseases
- Do NOT give treatment or medication advice
- Always include a medical disclaimer

Respond ONLY in valid JSON with keys:
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

        // Defensive parsing (prevents crash if model misbehaves)
        let output;
        try {
            output = JSON.parse(data.choices[0].message.content);
        } catch {
            return res.status(500).json({
                error: "Invalid response format from AI service"
            });
        }

        res.json(output);
    } catch (err) {
        res.status(500).json({ error: "Service unavailable" });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
