import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, MoreVertical, Pencil, Trash2, Globe } from 'lucide-react';
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
import { RoutineDetails } from '@/components/routine-details';
import type { Routine } from '@/lib/types';
import { Badge } from './ui/badge';

interface RoutineCardProps {
  routine: Routine;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoutineCard({ routine, onEdit, onDelete }: RoutineCardProps) {
  const routineImage = routine.imageUrl || (routine.exercises.length > 0 ? routine.exercises[0].image : 'https://picsum.photos/seed/101/600/400');
  const routineImageHint = routine.imageHint || (routine.exercises.length > 0 ? routine.exercises[0].imageHint : 'fitness workout');

  return (
    <Dialog>
      <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={routineImage}
            alt={routine.name}
            fill
            className="object-cover"
            data-ai-hint={routineImageHint}
          />
          {routine.isPreloaded && (
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
                <DropdownMenuItem onClick={onEdit} disabled={routine.isPreloaded}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} disabled={routine.isPreloaded} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/40">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="font-headline">{routine.name}</CardTitle>
          <CardDescription className="line-clamp-2">{routine.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Dumbbell className="mr-2 h-4 w-4" />
            <span>{routine.exercises.length} exercises</span>
          </div>
        </CardContent>
        <CardFooter>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Routine</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{routine.name}</DialogTitle>
        </DialogHeader>
        <RoutineDetails routine={routine} />
      </DialogContent>
    </Dialog>
  );
}
