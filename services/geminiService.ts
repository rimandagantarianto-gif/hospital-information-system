import { GoogleGenAI, Type } from "@google/genai";
import { FinancialRecord, Patient } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const summarizeClinicalNotes = async (patientName: string, notes: string, fhirData: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert medical documentation assistant (SCHOA).
      
      Patient: ${patientName}
      Raw FHIR Data: ${fhirData}
      Clinical Notes: ${notes}
      
      Task: Create a professional "After Visit Summary" and a draft "History & Physical" (H&P) note.
      Format: Markdown.
      Tone: Professional, Clinical, Objective.
      
      Include:
      1. Chief Complaint & HPI
      2. Key Vital Signs/Observations (extracted from notes)
      3. Assessment & Plan
      4. Patient Instructions (friendly language for this section)
      
      Disclaimer: Append a footer stating this is an AI-generated draft and must be verified by a physician.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Gemini Clinical Error:", error);
    return "Error connecting to AI service. Please check API key.";
  }
};

export const analyzeFinancials = async (data: FinancialRecord[]): Promise<string> => {
  try {
    const dataString = JSON.stringify(data);
    const prompt = `
      You are a Chief Financial Officer assistant for a hospital.
      
      Data (Last 5 Months): ${dataString}
      
      Task: Provide a strategic financial analysis.
      1. Identify revenue trends and expense anomalies.
      2. Calculate the average Net Profit Margin.
      3. Suggest 2 operational efficiency improvements based on the ratio of Payroll to Revenue.
      4. Format as a concise executive brief in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Failed to generate analysis.";
  } catch (error) {
    console.error("Gemini Financial Error:", error);
    return "Error generating financial insights.";
  }
};

export const semanticSearchPatients = async (query: string, patients: Patient[]): Promise<{ matchedIds: string[], explanation: string }> => {
  try {
    // We will ask Gemini to filter the array for us to simulate a vector/semantic search
    // In a real app, this would use embeddings.
    const simplifiedPatients = patients.map(p => ({
      id: p.id,
      name: p.name,
      condition: p.condition,
      notes: p.clinicalNotes
    }));

    const prompt = `
      You are a smart search engine for patient records.
      
      Query: "${query}"
      
      Database: ${JSON.stringify(simplifiedPatients)}
      
      Task: Return a JSON object with two fields:
      1. "matchedIds": an array of patient IDs that match the query semantically.
      2. "explanation": A brief sentence explaining why they matched.
      
      Example Query: "Patients with heart issues"
      Example Output: { "matchedIds": ["P-1002"], "explanation": "Selected patients with hypertension or cardiac history." }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      matchedIds: result.matchedIds || [],
      explanation: result.explanation || "No explanation provided."
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { matchedIds: [], explanation: "AI Search unavailable." };
  }
};
