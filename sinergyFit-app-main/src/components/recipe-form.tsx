'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Recipe } from '@/lib/types';
import placeholderData from '@/lib/placeholder-images.json';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFirebaseApp, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const { placeholderImages } = placeholderData;

const recipeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Recipe name must be at least 2 characters'),
  ingredients: z.string().min(10, 'Ingredients must be at least 10 characters'),
  instructions: z.string().min(20, 'Instructions must be at least 20 characters'),
  imageUrl: z.string().optional(),
});

type RecipeFormValues = {
  id?: string;
  name: string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
};

interface RecipeFormProps {
  onSubmit: (data: Recipe) => void;
  recipe?: Recipe | null;
}

const defaultRecipeImage = placeholderImages.find(img => img.id === "recipe-chicken-stir-fry");

export function RecipeForm({ onSubmit, recipe }: RecipeFormProps) {
  const firebaseApp = useFirebaseApp();
  const { user } = useUser();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(recipe?.image || null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe ? {
      ...recipe,
      imageUrl: recipe.image,
      ingredients: recipe.ingredients.join('\n'),
    } : {
      name: '',
      ingredients: '',
      instructions: '',
    },
  });
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && firebaseApp && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setUploading(true);
      try {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `users/${user.uid}/recipe-images/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        form.setValue('imageUrl', downloadURL);
        setImagePreview(downloadURL);
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast({
            variant: "destructive",
            title: "Image Upload Failed",
            description: error.message || "Could not upload image. Please try again.",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = (values: RecipeFormValues) => {
    const finalData: Recipe = {
      id: recipe?.id || `recipe-${Date.now()}`,
      name: values.name,
      ingredients: values.ingredients.split('\n').filter(line => line.trim() !== ''),
      instructions: values.instructions,
      image: values.imageUrl || defaultRecipeImage?.imageUrl || '',
      imageHint: 'custom recipe',
      isPreloaded: false,
    };
    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Healthy Banana Bread" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List each ingredient on a new line" {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Step-by-step preparation instructions" {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Recipe Photo</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={!user || uploading}/>
              </FormControl>
              <FormDescription>
                {uploading ? 'Uploading...' : 'Upload a photo of your delicious meal.'}
              </FormDescription>
              {imagePreview && <img src={imagePreview} alt="Recipe preview" className="mt-4 rounded-md object-cover w-full h-48" />}
            </FormItem>

          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={uploading}>{recipe ? 'Save Changes' : 'Add Recipe'}</Button>
        </div>
      </form>
    </Form>
  );
}
