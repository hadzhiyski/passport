import { Button } from '@passport/components/ui/button';
import { Card, CardContent } from '@passport/components/ui/card';
import HeroImage from '@passport/public/hero.png';
import { Calendar, Folder, Globe, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  { title: 'Pet Profiles & Digital Passports', Icon: PawPrint },
  { title: 'Reminders for Vaccines & Vet Visits', Icon: Calendar },
  { title: 'Document Storage & GR Sharing', Icon: Folder },
  { title: 'Travel-Ready with EU Compliance', Icon: Globe },
];

export function LandingPage() {
  return (
    <div className='min-h-screen'>
      <section className='container mx-auto px-6 md:px-12 py-12 flex flex-col-reverse md:flex-row items-center gap-8'>
        <div className='flex-1'>
          <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
            Your Pet’s Health, Organized and Always With You
          </h1>
          <p className='mt-4 text-lg'>
            Digital pet passports, smart reminders, and secure health tracking –
            all in one app.
          </p>
          <div className='mt-6 flex flex-wrap gap-4'>
            <Button variant='default' asChild>
              <Link href='/auth/login?screen_hint=signup'>Create Account</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/learn-more'>Learn More</Link>
            </Button>
          </div>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='w-full max-w-sm h-96 rounded-lg'>
            <Image
              src={HeroImage}
              alt='Hero'
              className='w-full h-full object-contain'
            />
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-6 md:px-12'>
          <h2 className='text-2xl md:text-3xl font-semibold'>
            Lost vaccine records? Forgotten deworming dates? Complicated travel
            docs?
          </h2>
          <p className='mt-2'>
            With <span className='font-medium'>Passport</span>, everything is
            just a tap away – organized, safe, and shareable.
          </p>
          <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map(({ title, Icon }) => (
              <Card key={title} className='hover:shadow-lg transition-shadow'>
                <CardContent className='flex flex-col items-center text-center p-6'>
                  <Icon className='w-8 h-8 mb-4' />
                  <p className='font-medium'>{title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className='mt-4 text-sm'>• Privacy-first & GDPR Compliant</p>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-6 md:px-12 text-center'>
          <p className='text-xl md:text-2xl font-medium'>
            Start keeping your pet healthy, safe, and travel-ready.
          </p>
          <div className='mt-6'>
            <Button variant='default' asChild>
              <Link href='/auth/login?screen_hint=signup'>Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
