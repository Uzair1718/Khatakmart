'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSettings } from './actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type State = {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Save Changes
    </Button>
  );
}

export function SettingsForm({ currentUsername }: { currentUsername: string }) {
  const initialState: State = { message: '', errors: {} };
  const [state, dispatch] = useFormState(updateSettings, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({
        title: 'Success',
        description: state.message,
      });
    } else if (state?.message && state.errors) {
       const errorMsg = Object.values(state.errors).flat().join('\n');
       toast({
        title: 'Error',
        description: errorMsg || state.message,
        variant: 'destructive',
       })
    }
  }, [state, toast]);

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle>Admin Credentials</CardTitle>
          <CardDescription>
            Update the username and password used to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={currentUsername}
              required
            />
            {state?.errors?.username && <p className="text-sm text-destructive mt-1">{state.errors.username[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password (optional)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
            />
             {state?.errors?.password && <p className="text-sm text-destructive mt-1">{state.errors.password[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className='flex justify-end'>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
