import type { Routine, Recipe } from './types';
import placeholderData from './placeholder-images.json';
const { placeholderImages } = placeholderData;

const getImage = (id: string) => {
  const image = placeholderImages.find(img => img.id === id);
  return image ? { url: image.imageUrl, hint: image.imageHint } : { url: '', hint: '' };
};

export const preloadedRoutines: Routine[] = [
  {
    id: 'routine-1',
    name: 'Full Body Blast',
    description: 'A comprehensive workout targeting all major muscle groups for balanced strength and conditioning.',
    isPreloaded: true,
    exercises: [
      {
        id: 'ex-1-1',
        name: 'Squats',
        sets: 3,
        reps: '10-12',
        description: 'A fundamental compound exercise that strengthens your legs, glutes, and core.',
        image: getImage('exercise-squat').url,
        imageHint: getImage('exercise-squat').hint,
      },
      {
        id: 'ex-1-2',
        name: 'Push-ups',
        sets: 3,
        reps: 'As many as possible',
        description: 'Builds upper body and core strength. Modify by doing them on your knees if needed.',
        image: getImage('exercise-pushup').url,
        imageHint: getImage('exercise-pushup').hint,
      },
      {
        id: 'ex-1-3',
        name: 'Plank',
        sets: 3,
        reps: '60 seconds',
        description: 'An isometric core strength exercise that works the abs, back, and shoulders.',
        image: getImage('exercise-plank').url,
        imageHint: getImage('exercise-plank').hint,
      },
    ],
  },
  {
    id: 'routine-2',
    name: 'Upper Body Strength',
    description: 'Focus on building strength and muscle definition in your chest, back, shoulders, and arms.',
    isPreloaded: true,
    exercises: [
      {
        id: 'ex-2-1',
        name: 'Bicep Curls',
        sets: 3,
        reps: '10-12 per arm',
        description: 'Isolate and build your bicep muscles with this classic dumbbell exercise.',
        image: getImage('exercise-bicep-curl').url,
        imageHint: getImage('exercise-bicep-curl').hint,
      },
      {
        id: 'ex-2-2',
        name: 'Push-ups',
        sets: 3,
        reps: '10-15',
        description: 'Excellent for chest, shoulders, and triceps. A bodyweight staple.',
        image: getImage('exercise-pushup').url,
        imageHint: getImage('exercise-pushup').hint,
      },
    ],
  },
  {
    id: 'routine-3',
    name: 'Lower Body Power',
    description: 'Develop powerful and toned legs and glutes with these targeted exercises.',
    isPreloaded: true,
    exercises: [
      {
        id: 'ex-3-1',
        name: 'Squats',
        sets: 4,
        reps: '8-10',
        description: 'The king of leg exercises, targeting quads, hamstrings, and glutes.',
        image: getImage('exercise-squat').url,
        imageHint: getImage('exercise-squat').hint,
      },
    ],
  },
  {
    id: 'routine-4',
    name: 'Cardio Burn',
    description: 'Elevate your heart rate, improve endurance, and burn calories with this cardio session.',
    isPreloaded: true,
    exercises: [
      {
        id: 'ex-4-1',
        name: 'Running',
        sets: 1,
        reps: '20-30 minutes',
        description: 'A great way to improve cardiovascular health. Can be done on a treadmill or outdoors.',
        image: getImage('exercise-running').url,
        imageHint: getImage('exercise-running').hint,
      },
    ],
  },
];

export const preloadedRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Chicken Stir-fry',
    ingredients: [
      '1 lb chicken breast, sliced',
      '2 cups broccoli florets',
      '1 red bell pepper, sliced',
      '1 carrot, julienned',
      '1/4 cup soy sauce',
      '2 tbsp honey',
      '1 tbsp sesame oil',
      '2 cloves garlic, minced',
      '1 tsp ginger, grated',
      'Cooked rice, for serving',
    ],
    instructions: '1. In a small bowl, whisk together soy sauce, honey, sesame oil, garlic, and ginger. \n2. Heat a large skillet or wok over medium-high heat. Add chicken and cook until browned and cooked through. \n3. Add broccoli, bell pepper, and carrot to the skillet. Cook until tender-crisp. \n4. Pour the sauce over the chicken and vegetables. Cook for 1-2 minutes until heated through. \n5. Serve immediately over cooked rice.',
    isPreloaded: true,
    image: getImage('recipe-chicken-stir-fry').url,
    imageHint: getImage('recipe-chicken-stir-fry').hint,
  },
  {
    id: 'recipe-2',
    name: 'Hearty Lentil Soup',
    ingredients: [
      '1 tbsp olive oil',
      '1 large onion, chopped',
      '2 carrots, chopped',
      '2 celery stalks, chopped',
      '2 cloves garlic, minced',
      '1 cup brown or green lentils, rinsed',
      '8 cups vegetable broth',
      '1 (14.5 oz) can diced tomatoes',
      '1 tsp dried thyme',
      'Salt and pepper to taste',
    ],
    instructions: '1. Heat olive oil in a large pot or Dutch oven over medium heat. \n2. Add onion, carrots, and celery and cook until softened, about 5-7 minutes. Add garlic and cook for another minute. \n3. Stir in lentils, vegetable broth, diced tomatoes, and thyme. \n4. Bring to a boil, then reduce heat and simmer for 45-60 minutes, or until lentils are tender. \n5. Season with salt and pepper to taste before serving.',
    isPreloaded: true,
    image: getImage('recipe-lentil-soup').url,
    imageHint: getImage('recipe-lentil-soup').hint,
  },
  {
    id: 'recipe-3',
    name: 'Quick Breakfast Smoothie',
    ingredients: [
      '1 ripe banana',
      '1/2 cup mixed berries (fresh or frozen)',
      '1/2 cup Greek yogurt',
      '1/2 cup milk (dairy or non-dairy)',
      '1 tbsp honey or maple syrup (optional)',
      '1 tbsp chia seeds or flax seeds',
    ],
    instructions: '1. Combine all ingredients in a blender. \n2. Blend until smooth and creamy. \n3. If the smoothie is too thick, add a little more milk. If it\'s too thin, add more fruit or yogurt. \n4. Pour into a glass and enjoy immediately.',
    isPreloaded: true,
    image: getImage('recipe-breakfast-smoothie').url,
    imageHint: getImage('recipe-breakfast-smoothie').hint,
  },
];
