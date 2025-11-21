import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Helper to check for API key
const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCalligraphySample = async (text: string, style: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Create a high-quality, artistic calligraphy image of the text "${text}". 
  The style must be strictly "${style}". 
  Ensure high contrast, black ink on clean white or textured parchment paper. 
  The focus should be solely on the typography and stroke quality. No background objects.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};

export const critiqueCalligraphy = async (base64Image: string, userGoal: string): Promise<string> => {
  const ai = getAiClient();
  
  // Strip header if present to get raw base64
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, standardizing request
              data: base64Data
            }
          },
          {
            text: `Act as a master calligraphy professor. Analyze this student's work. 
            The student is attempting: ${userGoal}.
            Provide a concise, constructive critique focusing on:
            1. Stroke consistency (thick vs thin).
            2. Spacing and rhythm.
            3. Letterform accuracy.
            4. One specific actionable tip for improvement.
            Format with markdown bolding for key terms.`
          }
        ]
      }
    });

    return response.text || "Unable to generate critique.";
  } catch (error) {
    console.error("Critique failed:", error);
    throw error;
  }
};

export const getStyleHistory = async (styleName: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, engaging paragraph (max 100 words) about the history and key characteristics of the ${styleName} calligraphy style. Focus on its origin and what makes it unique.`
    });
    return response.text || "History unavailable.";
  } catch (error) {
    console.error("History fetch failed:", error);
    return "Could not fetch history.";
  }
};
