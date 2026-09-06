import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function cleanJSON(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
}

app.post("/api/idea", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const {
      resource = "",
      minutes = "30",
      cause = "",
      location = "",
      accessibility = ""
    } = req.body || {};

    if (!resource.trim()) {
      return res.status(400).json({ error: "Tell us what you can offer." });
    }

    const prompt = `
You are KindDrop, a practical generosity planner.

A person wants to help someone today using what they already have.

What they can offer: ${resource}
Time available: ${minutes} minutes
Cause/person/community they care about: ${cause || "open to suggestions"}
General location/context: ${location || "not specified"}
Accessibility or personal constraints: ${accessibility || "none specified"}

Create ONE realistic, low-cost micro-act of generosity they can complete today.

Rules:
- Never shame the user or exaggerate impact.
- Respect consent, privacy, dignity, disability access, and personal safety.
- Do not recommend entering dangerous places, handling medical crises, or giving away essential personal resources.
- Prefer local, concrete, verifiable action over vague inspiration.
- If direct giving is involved, recommend transparent/consent-based handling.
- Make the plan achievable within the stated time.
- Avoid assuming the identity, religion, income, or needs of recipients.

Return ONLY valid JSON with exactly these keys:
{
  "title": "short memorable action name",
  "why": "1-2 sentences explaining why this is useful",
  "steps": ["3 to 5 short concrete steps"],
  "message": "a short respectful message the user can send or say",
  "safety": "one concise safety/consent note",
  "impact": "one simple way to record impact without performative or invasive tracking",
  "next": "one optional follow-up action for another day"
}
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt
    });

    const result = JSON.parse(cleanJSON(interaction.output_text));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "I couldn't create an idea right now. Try again in a moment."
    });
  }
});

app.listen(port, () => {
  console.log(`KindDrop running at http://localhost:${port}`);
});
