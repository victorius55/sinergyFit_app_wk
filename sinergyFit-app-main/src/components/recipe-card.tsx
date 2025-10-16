import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MoreVertical, Pencil, Trash2, Utensils, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RecipeDetails } from '@/components/recipe-details';
import type { Recipe } from '@/lib/types';
import { Badge } from './ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <Dialog>
      <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
            data-ai-hint={recipe.imageHint}
          />
           {recipe.isPreloaded && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              <Globe className="mr-1.5 h-3 w-3" />
              Preloaded
            </Badge>
          )}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} disabled={recipe.isPreloaded}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} disabled={recipe.isPreloaded} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/40">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="font-headline">{recipe.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Utensils className="mr-2 h-4 w-4" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </CardContent>
        <CardFooter>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Recipe</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
        </DialogHeader>
        <RecipeDetails recipe={recipe} />
      </DialogContent>
    </Dialog>
  );
}
