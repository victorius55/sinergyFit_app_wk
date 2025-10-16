'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeForm } from '@/components/recipe-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

interface RecipesTabProps {
  initialRecipes: Recipe[];
}

export function RecipesTab({ initialRecipes }: RecipesTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  const userRecipesCollection = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'recipes') : null),
    [user, firestore]
  );
  
  const { data: userRecipes } = useCollection<Recipe>(userRecipesCollection);

  const allRecipes = useMemo(() => {
    const recipes = userRecipes || [];
    // Filter out preloaded recipes that have been added by the user
    const userRecipeIds = new Set(recipes.map(r => r.id.split('-')[1]));
    const preloaded = initialRecipes.filter(r => !userRecipeIds.has(r.id.split('-')[1]));
    return [...preloaded, ...recipes];
  }, [initialRecipes, userRecipes]);
  
  const handleAddRecipe = (newRecipe: Recipe) => {
    if (!userRecipesCollection) return;
    const { id, ...dataToSave } = newRecipe;
    const docRef = doc(userRecipesCollection, id);
    setDocumentNonBlocking(docRef, { ...dataToSave, isPreloaded: false }, { merge: true });
    setIsFormOpen(false);
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    if (!userRecipesCollection) return;
    const { id, ...dataToSave } = updatedRecipe;
    const docRef = doc(userRecipesCollection, id);
    setDocumentNonBlocking(docRef, dataToSave, { merge: true });
    setEditingRecipe(null);
    setIsFormOpen(false);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (!userRecipesCollection) return;
    deleteDocumentNonBlocking(doc(userRecipesCollection, recipeId));
  };
  
  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  }
  
  const onDialogClose = (open: boolean) => {
    if (!open) {
      setEditingRecipe(null);
    }
    setIsFormOpen(open);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-headline">Recipe Library</h2>
        <Dialog open={isFormOpen} onOpenChange={onDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
            </DialogHeader>
            <RecipeForm
              onSubmit={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
              recipe={editingRecipe}
            />
          </DialogContent>
        </Dialog>
      </div>
      {allRecipes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={() => handleEdit(recipe)}
              onDelete={() => handleDeleteRecipe(recipe.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No recipes found.</p>
          <p className="text-muted-foreground">Add your first one to get started!</p>
        </div>
      )}
    </div>
  );
}
