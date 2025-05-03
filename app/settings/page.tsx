import { ThemeSwitcher } from '@passport/components/settings/theme-switcher';

export default function SettingsPage() {
  // You can add your server-side code here later to fetch preferences & settings

  return (
    <div className='px-4 sm:px-6 md:px-8'>
      <div className='max-w-4xl mx-auto py-6 space-y-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Settings</h1>
          <p className='text-muted-foreground'>
            Manage your application preferences
          </p>
        </div>

        <div className='space-y-6'>
          <section>
            <ThemeSwitcher />
          </section>
        </div>
      </div>
    </div>
  );
}
