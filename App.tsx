
import React, { useState, useEffect, useCallback } from 'react';
import { WorkoutPlan, LogEntry, WorkoutDay } from './types';
import { PlanSetup } from './components/PlanSetup';
import { WorkoutCard } from './components/WorkoutCard';
import { ProgressInsights } from './components/ProgressInsights';
import { analyzeProgress } from './services/geminiService';
import { Dumbbell, LayoutDashboard, History, RotateCcw, Calendar, CheckCircle, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'workout' | 'stats'>('workout');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [dailyLoggedIds, setDailyLoggedIds] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState('Analisando seu desempenho...');

  // Persistence
  useEffect(() => {
    const savedPlan = localStorage.getItem('fitfocus_plan');
    const savedLogs = localStorage.getItem('fitfocus_logs');
    if (savedPlan) setPlan(JSON.parse(savedPlan));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    if (plan) localStorage.setItem('fitfocus_plan', JSON.stringify(plan));
    localStorage.setItem('fitfocus_logs', JSON.stringify(logs));
  }, [plan, logs]);

  const updateAIAnalysis = useCallback(async () => {
    if (logs.length > 5) {
      const analysis = await analyzeProgress(logs);
      setAiAnalysis(analysis);
    } else {
      setAiAnalysis("Continue treinando! Preciso de pelo menos 5 logs para começar a analisar seu progresso de bodybuilding.");
    }
  }, [logs]);

  useEffect(() => {
    if (activeTab === 'stats') {
      updateAIAnalysis();
    }
  }, [activeTab, updateAIAnalysis]);

  const handlePlanCreated = (newPlan: WorkoutPlan) => {
    setPlan(newPlan);
  };

  const logExercise = (exerciseId: string, exerciseName: string, muscleGroup: any, weight: number, reps: number) => {
    const newLog: LogEntry = {
      date: new Date().toISOString(),
      exerciseId,
      exerciseName,
      muscleGroup,
      setsCompleted: 1, 
      repsCompleted: reps,
      weight
    };
    setLogs(prev => [...prev, newLog]);
    setDailyLoggedIds(prev => [...prev, exerciseId]);
  };

  const getPersonalBest = (exerciseId: string) => {
    const exerciseLogs = logs.filter(l => l.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return 0;
    return Math.max(...exerciseLogs.map(l => l.weight));
  };

  const getLastWeight = (exerciseId: string) => {
    const exerciseLogs = logs.filter(l => l.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return undefined;
    return exerciseLogs[exerciseLogs.length - 1].weight;
  };

  const resetDailyProgress = () => {
    if (confirm("Resetar o progresso de hoje?")) {
      setDailyLoggedIds([]);
    }
  };

  const deletePlan = () => {
    if (confirm("Isso apagará seu plano e histórico. Continuar?")) {
      setPlan(null);
      setLogs([]);
      localStorage.removeItem('fitfocus_plan');
      localStorage.removeItem('fitfocus_logs');
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
        <PlanSetup onPlanCreated={handlePlanCreated} />
      </div>
    );
  }

  const currentDay = plan.days[currentDayIndex];

  return (
    <div className="min-h-screen bg-[#050505] pb-24 lg:pb-0 lg:pl-64 text-zinc-200">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-900 hidden lg:flex flex-col p-6 z-40">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Dumbbell className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">FITFOCUS <span className="text-indigo-500">PRO</span></h1>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Bodybuilding Elite</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('workout')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'workout' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
          >
            <Calendar size={18} />
            Sessão Atual
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'stats' ? 'bg-zinc-900 text-indigo-400 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
          >
            <LayoutDashboard size={18} />
            Análise Pro
          </button>
        </nav>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl mb-4">
           <div className="flex items-center gap-2 text-amber-500 mb-2">
              <Flame size={16} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">Streak</span>
           </div>
           <p className="text-xl font-black">{new Set(logs.map(l => l.date.split('T')[0])).size} Dias Ativos</p>
        </div>

        <button 
          onClick={deletePlan}
          className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-red-400 rounded-xl transition-all text-xs font-bold"
        >
          <RotateCcw size={16} />
          CONFIGURAÇÕES / RESET
        </button>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden p-4 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-indigo-500" size={20} />
          <h1 className="font-black tracking-tighter">FITFOCUS PRO</h1>
        </div>
        <button onClick={() => setActiveTab('stats')} className="text-zinc-400">
           <LayoutDashboard size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-4 lg:p-10 max-w-5xl mx-auto">
        {activeTab === 'workout' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{currentDay.title}</h2>
                <div className="flex items-center gap-2 text-zinc-500 mt-2 font-bold text-sm">
                   <Calendar size={14} />
                   <span>DIA {currentDayIndex + 1} • {currentDay.exercises.length} EXERCÍCIOS</span>
                </div>
              </div>
              <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 self-start shadow-xl">
                {plan.days.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentDayIndex(idx); setDailyLoggedIds([]); }}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentDayIndex === idx ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/40' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    D{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentDay.exercises.map((ex) => (
                <WorkoutCard
                  key={ex.id}
                  exercise={ex}
                  onLog={(weight, reps) => logExercise(ex.id, ex.name, ex.muscleGroup, weight, reps)}
                  isLogged={dailyLoggedIds.includes(ex.id)}
                  isPR={getLastWeight(ex.id) !== undefined && getPersonalBest(ex.id) >= 0} 
                  lastWeight={getLastWeight(ex.id)}
                />
              ))}
            </div>

            {dailyLoggedIds.length > 0 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-px w-32 bg-zinc-800" />
                <button 
                  onClick={resetDailyProgress}
                  className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  <History size={14} />
                  Limpar progresso de hoje
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-8">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Dashboards de Performance</h2>
                <p className="text-zinc-500 font-bold mt-1">Dados agregados dos seus últimos 3 meses de treino</p>
             </div>
            <ProgressInsights logs={logs} aiAnalysis={aiAnalysis} />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full lg:hidden bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-10 py-5 flex justify-around items-center z-40">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'workout' ? 'text-indigo-400 scale-110' : 'text-zinc-600'}`}
        >
          <Calendar size={26} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Treino</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'stats' ? 'text-indigo-400 scale-110' : 'text-zinc-600'}`}
        >
          <LayoutDashboard size={26} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Evolução</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
