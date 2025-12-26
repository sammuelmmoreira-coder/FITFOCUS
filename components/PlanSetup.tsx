
import React, { useState } from 'react';
import { parseWorkoutPlan } from '../services/geminiService';
import { WorkoutPlan } from '../types';
import { Loader2, Send } from 'lucide-react';

interface PlanSetupProps {
  onPlanCreated: (plan: WorkoutPlan) => void;
}

export const PlanSetup: React.FC<PlanSetupProps> = ({ onPlanCreated }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const plan = await parseWorkoutPlan(input);
      onPlanCreated(plan);
    } catch (error) {
      console.error("Failed to parse plan:", error);
      alert("Erro ao processar o plano. Tente descrevê-lo de forma mais clara.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400">Configure seu Treino</h2>
      <p className="text-zinc-400 mb-6">
        Cole sua lista de exercícios ou descreva seu treino de 5 dias. 
        Nossa IA irá estruturar tudo para você com dicas e metas.
      </p>
      
      <textarea
        className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 resize-none"
        placeholder="Ex: Segunda é peito e tríceps. Supino reto 4x12, Supino inclinado 3x10... Terça é costas..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Processando com IA...
          </>
        ) : (
          <>
            <Send size={20} />
            Gerar Meu Plano de 5 Dias
          </>
        )}
      </button>
    </div>
  );
};
