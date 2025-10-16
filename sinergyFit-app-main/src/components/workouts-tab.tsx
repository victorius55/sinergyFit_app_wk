'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Routine } from '@/lib/types';
import { RoutineCard } from '@/components/routine-card';
import { RoutineForm } from '@/components/routine-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

interface WorkoutsTabProps {
  initialRoutines: Routine[];
}

export function WorkoutsTab({ initialRoutines }: WorkoutsTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  const userRoutinesCollection = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'routines') : null),
    [user, firestore]
  );
  
  const { data: userRoutines } = useCollection<Routine>(userRoutinesCollection);

  const allRoutines = useMemo(() => {
    const routines = userRoutines || [];
    // Filter out preloaded routines that have been added by the user
    const userRoutineIds = new Set(routines.map(r => r.id.split('-')[1]));
    const preloaded = initialRoutines.filter(r => !userRoutineIds.has(r.id.split('-')[1]));
    return [...preloaded, ...routines];
  }, [initialRoutines, userRoutines]);
  
  const handleAddRoutine = (newRoutine: Routine) => {
    if (!userRoutinesCollection) return;
    const { id, ...dataToSave } = newRoutine;
    const docRef = doc(userRoutinesCollection, id);
    setDocumentNonBlocking(docRef, { ...dataToSave, isPreloaded: false }, { merge: true });
    setIsFormOpen(false);
  };

  const handleUpdateRoutine = (updatedRoutine: Routine) => {
    if (!userRoutinesCollection) return;
    const { id, ...dataToSave } = updatedRoutine;
    const docRef = doc(userRoutinesCollection, id);
    setDocumentNonBlocking(docRef, dataToSave, { merge: true });
    setEditingRoutine(null);
    setIsFormOpen(false);
  };

  const handleDeleteRoutine = (routineId: string) => {
    if (!userRoutinesCollection) return;
    deleteDocumentNonBlocking(doc(userRoutinesCollection, routineId));
  };
  
  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsFormOpen(true);
  }

  const onDialogClose = (open: boolean) => {
    if (!open) {
      setEditingRoutine(null);
    }
    setIsFormOpen(open);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-headline">Workout Routines</h2>
        <Dialog open={isFormOpen} onOpenChange={onDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingRoutine ? 'Edit Routine' : 'Create New Routine'}</DialogTitle>
            </DialogHeader>
            <RoutineForm
              onSubmit={editingRoutine ? handleUpdateRoutine : handleAddRoutine}
              routine={editingRoutine}
            />
          </DialogContent>
        </Dialog>
      </div>
      {allRoutines.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allRoutines.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={() => handleEdit(routine)}
              onDelete={() => handleDeleteRoutine(routine.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No routines found.</p>
          <p className="text-muted-foreground">Create your first one to get started!</p>
        </div>
      )}
    </div>
  );
}
