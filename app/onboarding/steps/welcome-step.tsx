'use client';

import { Button } from '@passport/components/ui/button';
import { Card } from '@passport/components/ui/card';
import { User } from '@passport/user';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Clock,
  PawPrint,
  Share2,
  Stethoscope,
  Syringe,
  Loader2,
} from 'lucide-react';

interface WelcomeStepProps {
  user: User;
  onComplete: () => void;
  isUpdating?: boolean;
}

const featureCards = [
  {
    title: 'Store health records',
    description:
      "Keep all your pets' health information organized in one secure place",
    icon: <BookOpen className='h-5 w-5 text-emerald-500' />,
  },
  {
    title: 'Track vaccinations',
    description: 'Never miss important shots with our vaccination tracking',
    icon: <Syringe className='h-5 w-5 text-blue-500' />,
  },
  {
    title: 'Record vet visits',
    description: 'Document veterinary visits and clinical examination details',
    icon: <Stethoscope className='h-5 w-5 text-violet-500' />,
  },
  {
    title: 'Manage treatments',
    description: 'Keep parasitic treatment schedules organized and up-to-date',
    icon: <CalendarCheck className='h-5 w-5 text-amber-500' />,
  },
  {
    title: 'Get timely reminders',
    description: 'Receive notifications for important health-related dates',
    icon: <Clock className='h-5 w-5 text-rose-500' />,
  },
  {
    title: 'Share with caregivers',
    description: 'Easily share pet information with vets and other caregivers',
    icon: <Share2 className='h-5 w-5 text-cyan-500' />,
  },
];

export function WelcomeStep({
  user,
  onComplete,
  isUpdating = false,
}: WelcomeStepProps) {
  return (
    <div className='space-y-8'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          <PawPrint className='h-12 w-12 text-primary' />
        </div>
      </div>

      <div className='text-center space-y-3'>
        <h2 className='text-2xl font-bold'>
          Welcome to Passport, {user.name.split(' ')[0]}!
        </h2>
        <p className='text-muted-foreground'>
          Let&apos;s help you get started with a quick setup to manage your
          pets&apos; health records.
        </p>
      </div>

      <h3 className='text-lg font-medium text-center'>
        With Passport, you can:
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {featureCards.map((feature, index) => (
          <Card
            key={index}
            className='p-4 flex flex-col border transition-all hover:shadow-md hover:border-primary/20'
          >
            <div className='flex items-center gap-3 mb-2'>
              <div className='flex items-center justify-center h-8 w-8 rounded-md bg-slate-50 dark:bg-slate-800'>
                {feature.icon}
              </div>
              <h4 className='font-medium'>{feature.title}</h4>
            </div>
            <p className='text-sm text-muted-foreground'>
              {feature.description}
            </p>
          </Card>
        ))}
      </div>

      <div className='flex justify-end pt-4'>
        <Button
          onClick={onComplete}
          size='lg'
          className='gap-2'
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            <>
              Create Your Profile
              <ArrowRight className='h-4 w-4' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
