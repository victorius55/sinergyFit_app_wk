import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Routine } from '@/lib/types';

interface RoutineDetailsProps {
  routine: Routine;
}

export function RoutineDetails({ routine }: RoutineDetailsProps) {
  return (
    <ScrollArea className="max-h-[60vh] pr-4">
      <div className="space-y-4">
        <p className="text-muted-foreground">{routine.description}</p>
        <Separator />
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Exercises</h3>
          {routine.exercises.map((exercise, index) => (
            <div key={exercise.id} className="grid grid-cols-[80px_1fr] gap-4 items-start">
              <div className="relative aspect-square w-20 h-20 rounded-md overflow-hidden">
                <Image
                  src={exercise.image}
                  alt={exercise.name}
                  fill
                  className="object-cover"
                  data-ai-hint={exercise.imageHint}
                />
              </div>
              <div>
                <h4 className="font-semibold">{exercise.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets x {exercise.reps} reps
                </p>
                <p className="text-sm mt-1">{exercise.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
