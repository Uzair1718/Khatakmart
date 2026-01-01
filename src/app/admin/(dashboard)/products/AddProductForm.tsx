'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data';
import { handleAddProduct } from './actions';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }),
  category: z.string().min(1, { message: "Please select a category" }),
});

type State = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
          </>
        ) : (
          'Add Product'
        )}
      </Button>
  );
}

export function AddProductForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const router = useRouter();

  const initialState: State = { message: '', errors: {}, success: false };
  const [state, dispatch] = useFormState(handleAddProduct, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Product Added',
        description: state.message,
      });
      setOpen(false);
      router.refresh();
    } else if (state.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, setOpen, router]);

  return (
    <form action={dispatch} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" placeholder="e.g. Basmati Rice 5kg" />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Product description" />
            {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="price">Price (PKR)</Label>
                <Input id="price" name="price" type="number" placeholder="1850" />
                {state.errors?.price && <p className="text-sm text-destructive">{state.errors.price[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" placeholder="50" />
                {state.errors?.stock && <p className="text-sm text-destructive">{state.errors.stock[0]}</p>}
            </div>
        </div>
        
        <div className="space-y-2">
             <Label htmlFor="category">Category</Label>
            <Select name="category">
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
        </div>

      <SubmitButton />
    </form>
  );
}
