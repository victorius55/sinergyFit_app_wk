'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Routine } from '@/lib/types';
import placeholderData from '@/lib/placeholder-images.json';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFirebaseApp, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const { placeholderImages } = placeholderData;

const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.coerce.number().min(1, 'Sets must be at least 1'),
  reps: z.string().min(1, 'Reps are required'),
  description: z.string().optional(),
  image: z.string().optional(),
  imageHint: z.string().optional(),
});

const routineSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Routine name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});

type RoutineFormValues = z.infer<typeof routineSchema>;

interface RoutineFormProps {
  onSubmit: (data: Routine) => void;
  routine?: Routine | null;
}

const defaultExerciseImage = placeholderImages.find(img => img.id === "exercise-bicep-curl");
const defaultRoutineImage = placeholderImages.find(img => img.id === 'routine-full-body');

export function RoutineForm({ onSubmit, routine }: RoutineFormProps) {
  const firebaseApp = useFirebaseApp();
  const { user } = useUser();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(routine?.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: routine || {
      name: '',
      description: '',
      exercises: [{ name: '', sets: 3, reps: '10-12', description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
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
        const storageRef = ref(storage, `users/${user.uid}/routine-images/${Date.now()}-${file.name}`);
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

  const handleSubmit = (values: RoutineFormValues) => {
    const finalData: Routine = {
      id: routine?.id || `routine-${Date.now()}`,
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl || defaultRoutineImage?.imageUrl,
      imageHint: 'custom routine',
      exercises: values.exercises.map(ex => ({
        ...ex,
        id: ex.id || `ex-${Date.now()}-${Math.random()}`,
        reps: ex.reps,
        image: ex.image || defaultExerciseImage?.imageUrl || '',
        imageHint: ex.imageHint || defaultExerciseImage?.imageHint || '',
      })),
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
                  <FormLabel>Routine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Workout" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the routine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Routine Photo</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={!user || uploading} />
              </FormControl>
              <FormDescription>
                {uploading ? 'Uploading...' : 'Upload a photo for the routine.'}
              </FormDescription>
              {imagePreview && <img src={imagePreview} alt="Routine preview" className="mt-4 rounded-md object-cover w-full h-48" />}
            </FormItem>

            <div>
              <h3 className="text-lg font-medium mb-2">Exercises</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name={`exercises.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exercise Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Push-ups" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.sets`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sets</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.reps`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reps</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 10-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       </div>
                       <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Keep your back straight" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       </div>
                    </div>
                  </div>
                ))}
                 <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ 
                      name: '', 
                      sets: 3, 
                      reps: '10-12', 
                      description: '', 
                      image: defaultExerciseImage?.imageUrl || '',
                      imageHint: defaultExerciseImage?.imageHint || '' 
                  })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={uploading}>{routine ? 'Save Changes' : 'Create Routine'}</Button>
        </div>
      </form>
    </Form>
  );
}
