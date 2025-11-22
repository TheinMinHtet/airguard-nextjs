import { GoogleGenAI, Type, Chat, FunctionDeclaration } from "@google/genai";
import { AQIData, HealthTip } from '../types';

const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const getHealthAdvice = async (aqiData: AQIData): Promise<HealthTip[]> => {
  const ai = getGeminiClient();
  
  const prompt = `
    Analyze the following air quality data:
    AQI: ${aqiData.aqi}
    PM2.5: ${aqiData.pm25}
    PM10: ${aqiData.pm10}
    NO2: ${aqiData.no2}
    Ozone: ${aqiData.o3}
    
    Provide 3 specific, actionable health recommendations based on this data.
    Classify each tip with an icon type: 'mask', 'window' (ventilation), 'exercise' (outdoor activity), or 'generic'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING, enum: ['mask', 'window', 'exercise', 'generic'] }
            },
            required: ['title', 'description', 'icon']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText) as HealthTip[];
  } catch (error) {
    console.error("Gemini Health Advice Error:", error);
    // Fallback advice if AI fails
    return [
      { title: "Monitor Levels", description: "Keep an eye on changing air quality.", icon: "generic" },
      { title: "Stay Hydrated", description: "Drinking water helps your body function.", icon: "generic" }
    ];
  }
};

export const createChatSession = (contextData?: any, tools?: FunctionDeclaration[]): Chat => {
  const ai = getGeminiClient();
  
  let systemInstruction = `You are AirGuard, an expert environmental and air quality assistant.

Your Mission:
1. **Analyze Live Context**: Use the provided location and air quality data.
2. **Global Knowledge**: If a user asks about a specific city, ALWAYS call the available tool 'getCityAirQuality' to get real data. Do not guess.
3. **Educate & Empower**: Teach users how to improve their environment.
4. **Tone**: Friendly, scientific but accessible, and proactive. Use emojis.`;
  
  if (contextData) {
    systemInstruction += `\n\n=== CURRENT USER CONTEXT ===\n${JSON.stringify(contextData, null, 2)}\nUse this data to answer questions about the user's CURRENT location.`;
  }

  const config: any = {
    systemInstruction: systemInstruction,
  };

  if (tools && tools.length > 0) {
    config.tools = [{ functionDeclarations: tools }];
  }

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: config
  });
};