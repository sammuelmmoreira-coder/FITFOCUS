
import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { CheckCircle2, Info, TrendingUp, Trophy } from 'lucide-react';

interface WorkoutCardProps {
  exercise: Exercise;
  onLog: (weight: number, reps: number) => void;
  isLogged: boolean;
  isPR?: boolean;
  lastWeight?: number;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise, onLog, isLogged, isPR, lastWeight }) => {
  const [weight, setWeight] = useState<string>('');
  // Fix: Handle rep ranges properly by extracting the average or minimum for the default input
  const [reps, setReps] = useState<string>('');
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    // If it's a range like "8-10", default to the higher end or the first number
    const defaultReps = exercise.reps.split('-')[0].trim().replace(/\D/g, '');
    setReps(defaultReps);
  }, [exercise.reps]);

  const handleLog = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!isNaN(w) && !isNaN(r)) {
      onLog(w, r);
    } else {
      alert("Por favor, insira peso e repetições válidos.");
    }
  };

  return (
    <div className={`relative p-5 rounded-2xl border transition-all duration-300 ${isLogged ? 'bg-zinc-900/50 border-emerald-900/50 shadow-inner' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 shadow-lg'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
              {exercise.muscleGroup}
            </span>
            {isPR && !isLogged && (
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Trophy size={10} /> PR Possível
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold mt-2 text-zinc-100">{exercise.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-zinc-400 font-medium">{exercise.sets} séries x <span className="text-indigo-300">{exercise.reps}</span></p>
            {lastWeight && <span className="text-[10px] text-zinc-500">Último: {lastWeight}kg</span>}
          </div>
        </div>
        <button 
          onClick={() => setShowTips(!showTips)}
          className={`p-2 rounded-full transition-colors ${showTips ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Info size={18} />
        </button>
      </div>

      {showTips && (
        <div className="mb-4 p-3 bg-zinc-950 border-l-2 border-indigo-500 rounded-r-lg text-xs text-zinc-300 leading-relaxed animate-in slide-in-from-top-2 duration-200">
          <span className="font-bold text-indigo-400 mr-1 italic">TÉCNICA:</span> {exercise.tips}
        </div>
      )}

      <div className="flex gap-3 items-end">
        <div className="flex-[2]">
          <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold tracking-tighter">Carga (kg)</label>
          <input
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isLogged}
            placeholder={lastWeight ? `${lastWeight}` : "0"}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all font-mono"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold tracking-tighter">Reps Feitas</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={isLogged}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all font-mono text-center"
          />
        </div>
        <button
          onClick={handleLog}
          disabled={isLogged}
          className={`h-12 px-5 rounded-xl flex items-center justify-center transition-all ${
            isLogged 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-zinc-100 hover:bg-white text-zinc-900 font-bold'
          }`}
        >
          {isLogged ? <CheckCircle2 size={22} /> : <TrendingUp size={22} />}
        </button>
      </div>

      {isPR && isLogged && (
        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/5 py-1 px-2 rounded w-fit border border-amber-500/20">
          <Trophy size={12} /> NOVO RECORD PESSOAL (PR)!
        </div>
      )}
    </div>
  );
};
