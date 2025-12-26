
export type MuscleGroup = 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Core' | 'Geral';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  tips: string;
  weight?: number;
}

export interface WorkoutDay {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  days: WorkoutDay[];
}

export interface LogEntry {
  date: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  setsCompleted: number;
  repsCompleted: number;
  weight: number;
}

export interface MuscleProgress {
  muscleGroup: MuscleGroup;
  totalVolume: number;
  sessionsCount: number;
  intensityScore: number;
  insight: string;
}
