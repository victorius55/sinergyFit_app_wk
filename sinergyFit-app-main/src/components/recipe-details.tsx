import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Recipe } from '@/lib/types';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <div className="space-y-4">
        <div className="relative aspect-video w-full rounded-md overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
            data-ai-hint={recipe.imageHint}
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <ul className="list-disc list-inside mt-2 text-muted-foreground">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold">Instructions</h3>
            <p className="whitespace-pre-wrap mt-2 text-muted-foreground">
              {recipe.instructions}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
