import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// ============================================================================
// CONSTANTS: Symptom Keywords and Body Parts
// ============================================================================

const symptomKeywords = [
  // General / common
  "fever",
  "high temperature",
  "chills",
  "sweating",
  "fatigue",
  "weakness",
  "cold",
  "malaise",
  "puffy",
  "swollen tongue",
  "headache",
  "dizziness",
  "confusion",
  "memory problems",
  "blurred vision",
  "vision problems",
  "hunger",
  "thirst",
  "cramp",

  // Gastrointestinal
  "nausea",
  "vomit",
  "vomiting",
  "throwing up",
  "diarrhea",
  "constipation",
  "abdominal pain",
  "bloating",
  "heartburn",
  "loss of appetite",
  "weight loss",
  "weight gain",
  "pain during urination",
  "dehydration",

  // Respiratory
  "cough",
  "shortness of breath",
  "breathlessness",
  "difficulty breathing",
  "chest pain",
  "chest tightness",
  "runny nose",
  "stuffy nose",
  "nasal congestion",
  "sore throat",
  "throat irritation",

  // Musculoskeletal / pain
  "joint pain",
  "muscle pain",
  "back pain",
  "arm pain",
  "leg pain",
  "body aches",

  // Skin / external
  "skin rash",
  "itching",
  "dry skin",
  "swelling",
  "pimple",
  "inflection",
  "acne",
  "breakout",
  "eye redness",
  "eye pain",
  "fungus",

  // Neurological / psychiatric
  "tremors",
  "fainting",
  "numbness",
  "tingling",
  "pins and needles",
  "insomnia",
  "excessive sleepiness",
  "anxiety",
  "depression",
  "irritability",

  // Cardiovascular / heart
  "palpitations",
  "rapid heartbeat",
  "heart racing",
  "high blood pressure",
  "low blood pressure",
  "heart rate",
  "heart attack",

  // Urinary / reproductive
  "frequent urination",
  "painful urination",
  "blood in urine",
  "penis pain",
  "vaginal bleeding",
  "menstrual bleeding",

  // Bleeding / emergency
  "bleeding",
  "blood in stool",
  "blood in vomit",
  "nosebleed",
  "coughing blood",
  "hemorrhage",

  // Other serious / warning signs
  "chest tightness",
  "severe headache",
  "difficulty speaking",
  "slurred speech",
  "facial drooping",
  "shortness of breath at rest",
  "swelling of face or lips",
  "confusion",
  "loss of consciousness",
];

const bodyParts = [
  "Head",
  "Brain",
  "Eyes",
  "Ears",
  "Nose",
  "Mouth",
  "Teeth",
  "Tongue",
  "Throat",
  "Neck",
  "Shoulders",
  "Arms",
  "Elbows",
  "Wrists",
  "Hands",
  "Fingers",
  "Chest",
  "Heart",
  "Lungs",
  "Ribs",
  "Back",
  "Spine",
  "Abdomen",
  "Stomach",
  "Liver",
  "Kidneys",
  "Pancreas",
  "Intestines",
  "Small intestine",
  "Large intestine",
  "Bladder",
  "Gallbladder",
  "Spleen",
  "Appendix",
  "Esophagus",
  "Trachea",
  "Diaphragm",
  "Pelvis",
  "Genitals",
  "Prostate",
  "Ovaries",
  "Uterus",
  "Testes",
  "Buttocks",
  "Hips",
  "Legs",
  "Thighs",
  "Knees",
  "Calves",
  "Ankles",
  "Feet",
  "Toes",
  "Skin",
  "Muscles",
  "Tendons",
  "Ligaments",
  "Joints",
  "Blood vessels",
  "Arteries",
  "Veins",
  "Lymph nodes",
  "Nerves",
  "Bones",
  "Bone marrow",
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates if the input text represents a symptom-related intent
 */
function isSymptomIntent(text: string): boolean {
  if (!text) return false;

  const input = text.toLowerCase().trim();
  return (
    symptomKeywords.some((w) => input.includes(w)) ||
    bodyParts.some((b) => input.includes(b.toLowerCase()) && input.includes("pain"))
  );
}

/**
 * Extracts symptom keywords from the input text
 */
function extractSymptoms(text: string): string[] {
  const input = text.toLowerCase();
  return symptomKeywords.filter((word) => input.includes(word));
}

/**
 * Safely parses AI response JSON with error handling
 */
function parseAIResponse(content: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(content);

    // Validate required fields
    if (
      typeof parsed.urgency !== "string" ||
      typeof parsed.department !== "string" ||
      typeof parsed.explanation !== "string"
    ) {
      return null;
    }

    return {
      urgency: parsed.urgency,
      department: parsed.department,
      explanation: parsed.explanation,
      medical_attention: parsed.medical_attention || "",
      disclaimer:
        parsed.disclaimer ||
        "This information is not a medical diagnosis and does not replace professional medical advice.",
    };
  } catch {
    return null;
  }
}

/**
 * Creates a Supabase client using environment variables
 */
function createSupabaseClient() {
  // Use standard Supabase environment variables (available in Edge Functions context)
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables. Edge Functions automatically provides SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

// ============================================================================
// HTTP HANDLERS
// ============================================================================

/**
 * Handles GET /triage - Returns welcome message
 */
function handleGetTriage(): Response {
  return new Response(
    JSON.stringify({
      message: "Welcome to the Clinical Triage API",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Handles POST /triage - Processes symptom input and returns triage assessment
 */
async function handlePostTriage(req: Request): Promise<Response> {
  try {
    // Parse request body
    let body: { message?: string };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { message } = body;

    // ---- INTENT VALIDATION BLOCK ----
    if (!message || !isSymptomIntent(message)) {
      const supabase = createSupabaseClient();

      // Log blocked attempt (anonymized)
      await supabase.from("triage_logs").insert({
        symptoms: [],
        urgency: "Low",
        department: "N/A",
        intent_valid: false,
      });

      return new Response(
        JSON.stringify({
          error: "This service is for symptom-related health concerns only.",
          disclaimer:
            "This information is not a medical diagnosis and does not replace professional medical advice.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ---- AI TRIAGE PROCESSING ----
    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterApiKey) {
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterApiKey}`,
        "Content-Type": "application/json",
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
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const aiData = await aiResponse.json();

    // ---- HARDENED JSON PARSING ----
    if (
      !aiData.choices ||
      !aiData.choices[0] ||
      !aiData.choices[0].message ||
      !aiData.choices[0].message.content
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid response format from AI service" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const output = parseAIResponse(aiData.choices[0].message.content);

    if (!output) {
      return new Response(
        JSON.stringify({ error: "Invalid response format from AI service" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ---- LOG SUCCESSFUL TRIAGE (ANONYMIZED) ----
    const supabase = createSupabaseClient();
    const extractedSymptoms = extractSymptoms(message);

    const { error: logError } = await supabase.from("triage_logs").insert({
      symptoms: extractedSymptoms,
      urgency: output.urgency,
      department: output.department,
      intent_valid: true,
    });

    if (logError) {
      console.error("Failed to log triage:", logError);
      // Still return success to client, but log the error
    }

    return new Response(JSON.stringify(output), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in POST /triage:", err);
    return new Response(
      JSON.stringify({ error: "Service unavailable" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

console.log("Triage Edge Function started");

serve(async (req: Request) => {
  console.log(`${req.method} ${new URL(req.url).pathname}`);
  
  // Enable CORS
  if (req.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Add CORS headers to all responses
  const addCorsHeaders = (response: Response) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  };

  // Route handling
  const url = new URL(req.url);

  if (url.pathname === "/triage" || url.pathname === "/triage/") {
    if (req.method === "GET") {
      return addCorsHeaders(handleGetTriage());
    }

    if (req.method === "POST") {
      return addCorsHeaders(await handlePostTriage(req));
    }

    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  return addCorsHeaders(
    new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  );
});
