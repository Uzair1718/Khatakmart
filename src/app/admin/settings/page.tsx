import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SettingsForm } from './SettingsForm';
import { getAdminUsername } from '@/lib/auth';

export default async function AdminSettingsPage() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('khattak_mart_auth');

  if (authCookie?.value !== 'true') {
    redirect('/admin/login');
  }

  const currentUsername = await getAdminUsername();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <SettingsForm currentUsername={currentUsername} />
    </div>
  );
}
