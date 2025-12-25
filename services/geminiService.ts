
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIPortfolioTip = async (stats: { galleries: number; photos: number; pending: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a photography business coach. A photographer has ${stats.galleries} active galleries, ${stats.photos} photos uploaded today, and ${stats.pending} pending client approvals. Provide one punchy, professional, and encouraging tip (max 20 words) for their dashboard.`
    });
    return response.text;
  } catch (error) {
    console.error("AI Tip failed", error);
    return "Your portfolio is growing! Keep capturing those unique perspectives.";
  }
};

export const analyzeGalleryStyle = async (galleryName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a 3-word aesthetic description for a photography gallery named "${galleryName}".`
    });
    return response.text;
  } catch (error) {
    return "Professional • High-Quality • Creative";
  }
};
