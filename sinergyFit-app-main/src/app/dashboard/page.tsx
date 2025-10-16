'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Utensils, CalendarDays } from "lucide-react";
import { WorkoutsTab } from "@/components/workouts-tab";
import { RecipesTab } from "@/components/recipes-tab";
import { PlannerTab } from "@/components/planner-tab";
import { preloadedRoutines, preloadedRecipes } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Recipe } from '@/lib/types';
import { collection } from 'firebase/firestore';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userRecipesCollection = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'recipes') : null),
    [user, firestore]
  );
  
  const { data: userRecipes } = useCollection<Recipe>(userRecipesCollection);

  const allRecipes = useMemo(() => {
    const recipes = userRecipes || [];
    // Filter out preloaded recipes that might have been added by the user to avoid duplicates
    // This assumes user-added recipes could have similar identifiers to preloaded ones if added manually
    const userRecipeIds = new Set(recipes.map(r => r.id.split('-').pop()));
    const uniquePreloaded = preloadedRecipes.filter(r => !userRecipeIds.has(r.id.split('-').pop()));
    return [...uniquePreloaded, ...recipes];
  }, [userRecipes]);


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="workouts" className="py-2 sm:py-1.5">
            <Dumbbell className="mr-2 h-4 w-4" />
            Workouts
          </TabsTrigger>
          <TabsTrigger value="recipes" className="py-2 sm:py-1.5">
            <Utensils className="mr-2 h-4 w-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="planner" className="py-2 sm:py-1.5">
            <CalendarDays className="mr-2 h-4 w-4" />
            Planner
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workouts" className="mt-6">
          <WorkoutsTab initialRoutines={preloadedRoutines} />
        </TabsContent>
        <TabsContent value="recipes" className="mt-6">
          <RecipesTab initialRecipes={preloadedRecipes} />
        </TabsContent>
        <TabsContent value="planner" className="mt-6">
          <PlannerTab allRecipes={allRecipes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
