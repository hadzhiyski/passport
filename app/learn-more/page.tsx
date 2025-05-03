import { Button } from '@passport/components/ui/button';
import { Separator } from '@passport/components/ui/separator';
import PassportImage from '@passport/public/passport.png';
import Image from 'next/image';

export default function LearnMorePage() {
  return (
    <main className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='max-w-7xl mx-auto py-16 px-4 grid gap-8 md:grid-cols-2 items-center'>
        <div>
          <h1 className='text-4xl font-bold mb-4'>Learn More About Passport</h1>
          <h2 className='text-2xl font-semibold mb-2'>Digital Pet Passports</h2>
          <p className='text-base leading-relaxed'>
            Create digital pet passports—add all their information, including
            dates of birth. Keep track of health records such as vaccinations,
            or treatments.
          </p>
        </div>
        <div className='flex justify-end'>
          <Image
            src={PassportImage}
            alt='Digital Pet Passport'
            className='w-full max-w-sm h-auto dark:invert'
          />
        </div>
      </section>
      <Separator />
      <section className='max-w-7xl mx-auto py-16 px-4 grid gap-8 md:grid-cols-3'>
        <div>
          <h3 className='text-xl font-semibold mb-2'>Smart Reminders</h3>
          <p className='text-base leading-relaxed'>
            Users can set optional reminders for upcoming vet visits,
            vaccinations, and other treatments.
          </p>
        </div>
        <div>
          <h3 className='text-xl font-semibold mb-2'>Secure Health Tracking</h3>
          <p className='text-base leading-relaxed'>
            Manage your pet&rsquo;s health history and documents in one place.
          </p>
        </div>
        <div>
          <h3 className='text-xl font-semibold mb-2'>Travel-Ready Features</h3>
          <p className='text-base leading-relaxed'>
            Use QR codes for your E-passports—easy pet with QR-code-change with
            EU-compliant document builder.
          </p>
        </div>
      </section>
      <Separator />
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-6'>
            Start using the app today to keep your pet healthy, safe, and
            travel-ready.
          </h2>
          <Button size='lg'>Sign Up Free</Button>
        </div>
      </section>
    </main>
  );
}
