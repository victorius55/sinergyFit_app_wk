export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  description: string;
  image: string;
  imageHint: string;
};

export type Routine = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  imageUrl?: string;
  imageHint?: string;
  isPreloaded?: boolean;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  image: string;
  imageHint: string;
  isPreloaded?: boolean;
};

export type MealPlan = {
  [day: string]: {
    breakfast?: Recipe | null;
    lunch?: Recipe | null;
    dinner?: Recipe | null;
  };
};
