'use server';

import { z } from 'zod';
import { updateCredentials } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const settingsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  password: z.string().optional(),
}).refine(data => !data.password || data.password.length >= 6, {
  message: "Password must be at least 6 characters long if provided.",
  path: ["password"],
});


export async function updateSettings(prevState: any, formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  
  // Don't include password if it's empty
  if (!values.password) {
    delete values.password;
  }

  const validatedFields = settingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updateCredentials(validatedFields.data.username, validatedFields.data.password);
    revalidatePath('/admin/settings');
    return { message: 'Settings updated successfully.', errors: {} };
  } catch (error) {
    return { message: 'Failed to update settings.', errors: {} };
  }
}
