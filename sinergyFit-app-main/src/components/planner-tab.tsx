'use client';

import { useMemo, useState } from 'react';
import type { Recipe, MealPlan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

interface PlannerTabProps {
  allRecipes: Recipe[];
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const meals = ['breakfast', 'lunch', 'dinner'] as const;

type MealPlanDoc = Omit<MealPlan, 'id'>;


export function PlannerTab({ allRecipes }: PlannerTabProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const mealPlanCollection = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'mealPlans') : null),
    [user, firestore]
  );
  
  // We'll assume a single meal plan document for the week for simplicity.
  const { data: mealPlans } = useCollection<MealPlan>(mealPlanCollection);
  const weeklyPlan = useMemo(() => mealPlans?.[0], [mealPlans]);

  const setRecipeForDay = (day: string, meal: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe | null) => {
    if (!mealPlanCollection) return;
    
    // For simplicity, we manage one document for the whole week.
    // The ID can be static or based on user/week.
    const planDocRef = doc(mealPlanCollection, weeklyPlan?.id || `weekly-plan-${user?.uid}`);

    const newDayPlan = { ...weeklyPlan?.[day], [meal]: recipe };
    const updatedPlan: Partial<MealPlan> = {
        ...(weeklyPlan || {}),
        [day]: newDayPlan,
    };
    
    // Remove id from the object before saving
    if ('id' in updatedPlan) {
      delete updatedPlan.id;
    }

    setDocumentNonBlocking(planDocRef, updatedPlan, { merge: true });
  };

  const getRecipeForDay = (day: string, meal: 'breakfast' | 'lunch' | 'dinner'): Recipe | null => {
    return weeklyPlan?.[day]?.[meal] || null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-6">Weekly Meal Planner</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysOfWeek.map(day => {
          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="font-headline">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {meals.map(meal => {
                    const currentRecipe = getRecipeForDay(day, meal);
                    return (
                        <div key={meal}>
                        <h4 className="font-semibold capitalize mb-2">{meal}</h4>
                        {currentRecipe ? (
                            <div className="group relative">
                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                <Image
                                src={currentRecipe.image}
                                alt={currentRecipe.name}
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                                data-ai-hint={currentRecipe.imageHint}
                                />
                                <span className="flex-1 text-sm">{currentRecipe.name}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => setRecipeForDay(day, meal, null)}
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            </div>
                        ) : (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start font-normal">
                                <Plus className="mr-2 h-4 w-4" /> Add recipe
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                <CommandInput placeholder="Search recipe..." />
                                <CommandList>
                                    <CommandEmpty>No recipes found.</CommandEmpty>
                                    <CommandGroup>
                                    {allRecipes.map(recipe => (
                                        <CommandItem
                                        key={recipe.id}
                                        value={recipe.name}
                                        onSelect={() => {
                                            setRecipeForDay(day, meal, recipe);
                                            // Close popover
                                            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                                        }}
                                        >
                                        {recipe.name}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </CommandList>
                                </Command>
                            </PopoverContent>
                            </Popover>
                        )}
                        </div>
                    )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
