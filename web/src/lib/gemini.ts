import { GoogleGenAI } from '@google/genai';
import type { Transaction } from '../types';

export async function generateDeepInsights(transactions: Transaction[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured in .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Filter transactions for the last 30 days to keep the context window reasonable
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTx = transactions
    .filter(t => new Date(t.date) >= thirtyDaysAgo)
    .map(t => `${t.date} | ${t.type.toUpperCase()} | ${t.merchant} | ${t.categoryId} | ₹${t.amount}`);

  const prompt = `
    You are an expert financial advisor named 'FinWrap AI'. Analyze the following raw transaction history for the user over the last 30 days.

    Transactions (Date | Type | Merchant | Category | Amount):
    ${recentTx.join('\n')}

    Please provide a concise, 3-paragraph financial analysis:
    1. A summary of their overarching spending behavior and primary cash flow.
    2. Any subtle patterns, subscriptions, or categories where they are bleeding money unnecessarily.
    3. Exactly 2 highly actionable, realistic recommendations to improve their savings rate next month.

    Keep the tone professional, encouraging, and direct. Do not use generic preamble like "Here is your analysis". Use markdown formatting (bolding, bullet points).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights could be generated at this time.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to communicate with Gemini AI. Please check your API key and connection.");
  }
}

export async function generateWrappedNarrative(
  totalSpent: number,
  totalSaved: number,
  biggestCategory: string,
  biggestCategoryAmount: number,
  biggestSplurge: string,
  biggestSplurgeAmount: number
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return "Your AI Wrapped is ready to go once you add your Gemini API Key to the .env file!";

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are writing a "Spotify Wrapped" style summary for a user's financial month. 
    Make it punchy, engaging, and slightly humorous (but not insulting). 
    Keep it very short—no more than 3 sentences total.
    
    Here is their data for the month:
    - Total Spent: ₹${totalSpent}
    - They ${totalSaved >= 0 ? 'Saved' : 'Overspent by'}: ₹${Math.abs(totalSaved)}
    - Their biggest money pit (category): ${biggestCategory} (₹${biggestCategoryAmount})
    - Their biggest single ridiculous splurge: ${biggestSplurge} (₹${biggestSplurgeAmount})

    Write the 3 sentence narrative directly, no introductions or markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "You survived another financial month.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Failed to load dynamic narrative.";
  }
}
