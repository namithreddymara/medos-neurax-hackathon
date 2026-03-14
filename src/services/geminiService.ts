import { GoogleGenAI, Type } from "@google/genai";
import { MedicalAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeMedicalDocument = async (
  text: string,
  type: string,
  fileData?: { data: string; mimeType: string },
  retryCount = 0
): Promise<MedicalAnalysis> => {
  const parts: any[] = [
    {
      text: `Analyze this medical document. Type: ${type}.
    
    Instructions:
    1. Extract all relevant medical information.
    2. Simplify complex medical jargon for a patient.
    3. Identify potential health risks or drug interactions.
    4. If it's a bill, look for potential overcharges or errors.
    5. Provide clear recommended actions.
    6. Generate a personalized nutrition plan based on the findings.
    
    Context: ${text}`
    }
  ];

  if (fileData) {
    parts.push({
      inlineData: {
        data: fileData.data.split(',')[1] || fileData.data,
        mimeType: fileData.mimeType
      }
    });
  }

  // Use Pro for first attempts, fallback to Flash if needed or after retries
  const modelName = retryCount > 0 ? "gemini-3-flash-preview" : "gemini-3.1-pro-preview";

  try {
    console.log(`Analyzing document (Attempt ${retryCount + 1}). Model: ${modelName}, Type: ${type}, Text length: ${text.length}`);
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief summary of the document in plain language." },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING, enum: ["low", "medium", "high"] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["level", "title", "description"]
              }
            },
            explanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  simpleExplanation: { type: Type.STRING }
                },
                required: ["term", "simpleExplanation"]
              }
            },
            billingDiscrepancies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  suggestedAction: { type: Type.STRING }
                }
              }
            },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            nutritionPlan: {
              type: Type.OBJECT,
              properties: {
                dietaryFocus: { type: Type.STRING },
                allowedFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                restrictedFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                mealSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                hydrationAdvice: { type: Type.STRING }
              },
              required: ["dietaryFocus", "allowedFoods", "restrictedFoods", "mealSuggestions", "hydrationAdvice"]
            },
            recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "risks", "explanations", "recommendedActions"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    // Clean response text in case of markdown blocks
    const cleanJson = response.text.replace(/```json\n?|\n?```/g, '').trim();
    console.log("Gemini analysis successful");
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error(`Gemini Analysis Error (Attempt ${retryCount + 1}):`, error.message);
    
    // Retry logic: up to 2 retries (total 3 attempts)
    if (retryCount < 2) {
      const nextRetry = retryCount + 1;
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return analyzeMedicalDocument(text, type, fileData, nextRetry);
    }

    throw new Error(`AI Analysis failed after multiple attempts: ${error.message || 'Unknown error'}`);
  }
};

export const chatWithAI = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  context?: string
): Promise<string> => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: history,
    config: {
      systemInstruction: `You are MedOS Pro AI, a helpful and professional medical assistant. 
      Use the provided medical context to answer user questions accurately. 
      Always advise users to consult with a real doctor for serious medical decisions.
      Keep answers concise and supportive.
      
      Medical Context: ${context || "No specific records uploaded yet."}`,
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I'm sorry, I couldn't process that request.";
};

export const generateAdvocacyEmail = async (
  analysis: MedicalAnalysis,
  recipientType: 'hospital' | 'pharmacy' | 'insurance'
): Promise<string> => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional, firm but polite email from a patient to a ${recipientType} based on the following medical analysis findings. 
    The goal is to advocate for the patient regarding detected risks or billing errors.
    
    Analysis:
    ${JSON.stringify(analysis)}`,
  });

  const result = await model;
  return result.text || "";
};

export const searchNearbyClinics = async (location: string): Promise<any> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find nearby medical clinics or healthcare providers near ${location}. Provide a list of names and addresses.`,
    config: {
      tools: [{ googleMaps: {} }]
    }
  });
  return response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
};
