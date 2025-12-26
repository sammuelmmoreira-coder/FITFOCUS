
import React, { useMemo } from 'react';
import { LogEntry, MuscleGroup } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { BrainCircuit, Activity, CalendarDays, TrendingUp } from 'lucide-react';

interface ProgressInsightsProps {
  logs: LogEntry[];
  aiAnalysis: string;
}

const MUSCLE_COLORS: Record<string, string> = {
  'Peito': '#6366f1',
  'Costas': '#8b5cf6',
  'Pernas': '#ec4899',
  'Ombros': '#06b6d4',
  'Braços': '#f59e0b',
  'Core': '#10b981',
  'Geral': '#71717a'
};

export const ProgressInsights: React.FC<ProgressInsightsProps> = ({ logs, aiAnalysis }) => {
  const muscleChartData = useMemo(() => {
    const volumeMap: Record<string, number> = {};
    logs.forEach(log => {
      const volume = log.weight * log.repsCompleted;
      volumeMap[log.muscleGroup] = (volumeMap[log.muscleGroup] || 0) + volume;
    });

    return Object.entries(volumeMap).map(([name, value]) => ({
      name,
      volume: value,
    })).sort((a, b) => b.volume - a.volume);
  }, [logs]);

  const timelineData = useMemo(() => {
    const dailyVolume: Record<string, number> = {};
    // Get last 90 days for 3-month view
    logs.forEach(log => {
      const day = log.date.split('T')[0];
      dailyVolume[day] = (dailyVolume[day] || 0) + (log.weight * log.repsCompleted);
    });

    return Object.entries(dailyVolume)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Show last 30 active days for clarity
  }, [logs]);

  const totalVolume = logs.reduce((acc, curr) => acc + (curr.weight * curr.repsCompleted), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Logs</p>
          <p className="text-2xl font-black text-white">{logs.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Volume Total (kg)</p>
          <p className="text-2xl font-black text-indigo-400">{totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sessões</p>
          <p className="text-2xl font-black text-emerald-400">{new Set(logs.map(l => l.date.split('T')[0])).size}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Consistência</p>
          <p className="text-2xl font-black text-amber-500">Altíssima</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="text-amber-500" size={24} />
          <h3 className="text-xl font-bold text-white">Consistência de Volume (30 Dias)</h3>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#6366f1" fillOpacity={1} fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-indigo-400" size={24} />
            <h3 className="text-xl font-bold text-white">Distribuição Muscular</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={muscleChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} width={70} />
                <Tooltip 
                  cursor={{fill: '#18181b'}}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                  {muscleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MUSCLE_COLORS[entry.name as MuscleGroup] || '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-950 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BrainCircuit size={120} />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold text-white">Relatório Pro Coach AI</h3>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {aiAnalysis}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-indigo-400 font-bold bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full border border-indigo-500/20">
            <TrendingUp size={14} /> Sugestão: Focar em Progressão de Carga nos Compostos.
          </div>
        </div>
      </div>
    </div>
  );
};
