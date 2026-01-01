'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleUpdateProduct } from './actions';
import type { Category, Product } from '@/lib/types';
import Image from 'next/image';

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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
  );
}

export function EditProductForm({ setOpen, categories, product }: { setOpen: (open: boolean) => void, categories: Category[], product: Product }) {
  const { toast } = useToast();
  const router = useRouter();

  const initialState: State = { message: '', errors: {}, success: false };
  const [state, dispatch] = useFormState(handleUpdateProduct, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Product Updated',
        description: state.message,
      });
      setOpen(false);
      router.refresh();
    } else if (state.message && !state.success) {
        const errorMsg = state.errors ? Object.values(state.errors).flat().join('; ') : state.message;
        toast({
            title: 'Error',
            description: errorMsg,
            variant: 'destructive',
        });
    }
  }, [state, toast, setOpen, router]);

  return (
    <form action={dispatch} className="space-y-4">
        <Input type="hidden" name="id" value={product.id} />
        <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" defaultValue={product.name} />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product.description} />
            {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="price">Price (PKR)</Label>
                <Input id="price" name="price" type="number" defaultValue={product.price} />
                {state.errors?.price && <p className="text-sm text-destructive">{state.errors.price[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" defaultValue={product.stock} />
                {state.errors?.stock && <p className="text-sm text-destructive">{state.errors.stock[0]}</p>}
            </div>
        </div>
        
        <div className="space-y-2">
             <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={product.category}>
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

        <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative h-24 w-24 rounded-md overflow-hidden">
                <Image src={product.image.imageUrl} alt={product.name} fill className="object-cover" />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="image">New Product Image (Optional)</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
            <p className="text-xs text-muted-foreground">Leave blank to keep the current image.</p>
            {state.errors?.image && <p className="text-sm text-destructive">{state.errors.image[0]}</p>}
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" name="isFeatured" defaultChecked={product.isFeatured} />
            <Label htmlFor="isFeatured">Mark as featured product</Label>
        </div>


      <SubmitButton />
    </form>
  );
}
