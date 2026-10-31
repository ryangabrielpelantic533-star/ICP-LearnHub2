import express from "express";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(express.json({ limit: "20mb" }));

// Basic per-IP limit to reduce accidental API usage.
const requestCounts = new Map();
app.use("/api/tutor", (req, res, next) => {
  const now = Date.now();
  const key = req.ip || "unknown";
  let entry = requestCounts.get(key);
  if (!entry || now - entry.startedAt > 60_000) {
    entry = { startedAt: now, count: 0 };
    requestCounts.set(key, entry);
  }
  entry.count += 1;
  if (entry.count > 15) {
    return res.status(429).json({ error: "Too many tutor requests. Please wait one minute and try again." });
  }
  next();
});

app.post("/api/tutor", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "The backend is running, but GEMINI_API_KEY is missing. Add it to your .env file and restart the server."
      });
    }

    const rawMessages = req.body?.messages;
    const images = req.body?.images ?? [];

    if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > 12) {
      return res.status(400).json({ error: "Please send a conversation with 1 to 12 messages." });
    }
    if (!Array.isArray(images) || images.length > 3) {
      return res.status(400).json({ error: "You can attach up to 3 images at a time." });
    }

    const contents = rawMessages.map((message) => {
      if (!["user", "assistant"].includes(message?.role) || typeof message?.content !== "string") {
        throw new Error("Invalid message format.");
      }
      return {
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content.slice(0, 12000) }]
      };
    });

    // The ICP LearnHub frontend sends image data as base64.
    if (images.length) {
      const lastUserMessage = [...contents].reverse().find((message) => message.role === "user");
      if (!lastUserMessage) {
        return res.status(400).json({ error: "An image must be sent with a student message." });
      }

      for (const image of images) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(image?.type) || typeof image?.data !== "string") {
          return res.status(400).json({ error: "Unsupported image format. Please use JPG, PNG, or WEBP." });
        }
        if (image.data.length > 12_000_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.data)) {
          return res.status(400).json({ error: "An image is too large or has invalid data." });
        }
        lastUserMessage.parts.push({
          inlineData: { mimeType: image.type, data: image.data }
        });
      }
    }

    const ai = new GoogleGenAI({ apiKey });
    let response;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction:
          "You are the ICP LearnHub AI Tutor, a friendly and patient tutor for school students. " +
          "Explain ideas clearly in age-appropriate language, use short steps and helpful examples, " +
          "encourage learning instead of simply giving answers, and be respectful. " +
          "If a student asks about a practice-test question, give hints and explain the concept. " +
          "Do not claim to know school-specific facts that were not provided. Keep answers focused.",
        maxOutputTokens: 700
      }
    });

    break;
  } catch (error) {
    const isBusy =
      error.status === 503 ||
      error.code === 503 ||
      /503|UNAVAILABLE|high demand/i.test(error.message || "");

    if (!isBusy || attempt === 3) {
      throw error;
    }

    await new Promise(resolve =>
      setTimeout(resolve, attempt * 3000)
    );
  }
}

    return res.json({ text: response.text });
  } catch (error) {
    console.error("Tutor API error:", error);

    return res.status(500).json({
      error: error.message || "The AI Tutor could not process your request."
    });
  }
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`ICP LearnHub is running at http://localhost:${PORT}/ICP_LearnHub.html`);
  console.log(`AI model: ${MODEL} (Gemini)`);
});