
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutPlan, MuscleGroup, LogEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseWorkoutPlan = async (userInput: string): Promise<WorkoutPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transforme este texto de plano de treino em um JSON estruturado para musculação avançada. 
    O plano deve ter exatamente 5 dias. 
    INSTRUÇÕES IMPORTANTES:
    1. REPETIÇÕES: Preserve faixas de repetições (ex: "6-8", "10-12"). NÃO remova o hífen.
    2. DICAS: Forneça dicas técnicas focadas em biomecânica e hipertrofia (ex: "foco na fase excêntrica", "pico de contração").
    3. GRUPOS MUSCULARES: Use estritamente: Peito, Costas, Pernas, Ombros, Braços, Core.
    
    Texto do usuário: ${userInput}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      muscleGroup: { type: Type.STRING },
                      sets: { type: Type.NUMBER },
                      reps: { type: Type.STRING, description: "Range of reps, e.g., '8-10'" },
                      tips: { type: Type.STRING }
                    },
                    required: ["id", "name", "muscleGroup", "sets", "reps", "tips"]
                  }
                }
              },
              required: ["id", "title", "exercises"]
            }
          }
        },
        required: ["days"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeProgress = async (logs: LogEntry[]): Promise<string> => {
  if (logs.length === 0) return "Ainda não há dados suficientes para uma análise profunda.";

  // Send more logs for better 3-month analysis
  const historySummary = logs.slice(-50).map(l => `${l.date.split('T')[0]}: ${l.exerciseName} - ${l.weight}kg x ${l.repsCompleted} reps`).join('\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Você é um treinador de elite de Bodybuilding. Analise este histórico de treinos (até 3 meses de dados) e forneça:
    1. Avaliação de sobrecarga progressiva.
    2. Pontos fortes e fracos na divisão de volume.
    3. Sugestões de periodização para os próximos meses.
    
    Histórico:
    ${historySummary}`,
  });

  return response.text;
};
