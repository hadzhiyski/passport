import { Avatar, AvatarFallback } from '@passport/components/ui/avatar';
import { Badge } from '@passport/components/ui/badge';
import { Card, CardContent } from '@passport/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@passport/components/ui/tooltip';
import { format } from 'date-fns';
import {
  BookX,
  CalendarCheck,
  Clock,
  HeartPulse,
  Mars,
  ShieldCheck,
  Venus,
} from 'lucide-react';
import Link from 'next/link';

export interface PetCardProps {
  pet: {
    id: string;
    healthStatus: {
      needsAttention: boolean;
      hasExpiredVaccine: boolean;
      hasExpiredTreatment: boolean;
    };
    avatar: {
      color: string;
      initials: string;
    };
    name: string;
    sex?: 'male' | 'female';
    breed?: string;
    species?: string;
    age: string;
    colors?: string[];
    hasPassport: boolean;
    lastVaccination: {
      name: string | null;
      validUntil: Date;
      isExpired: boolean;
    } | null;
    latestTreatment: {
      name: string | null;
      validUntil: Date;
      type: string;
      isExpired: boolean;
      isExpiringSoon: boolean;
    } | null;
    soonExpiring: { type: string; name: string | null; date: Date }[];
  };
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <Link
      href={`/pets/${pet.id}`}
      key={pet.id}
      className='transition-transform hover:scale-[1.01] block h-full'
    >
      <Card className='h-full border-border overflow-hidden hover:shadow-lg transition-shadow relative'>
        {pet.healthStatus.needsAttention && (
          <div className='absolute top-0 right-0 m-4'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant='destructive'
                  className='rounded-full text-destructive-foreground font-medium'
                >
                  <HeartPulse className='h-3.5 w-3.5 mr-1' /> Needs attention
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm w-60'>
                  {pet.healthStatus.hasExpiredVaccine && (
                    <p>This pet has expired vaccinations</p>
                  )}
                  {pet.healthStatus.hasExpiredTreatment && (
                    <p>This pet has expired treatments</p>
                  )}
                  <p className='text-xs mt-1 opacity-80'>
                    Click to view details and update records
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {!pet.hasPassport && (
          <div className='absolute top-0 right-0 m-4'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant='destructive'
                  className='rounded-full text-destructive-foreground font-medium'
                >
                  <BookX className='h-3.5 w-3.5 mr-1' /> Missing passport
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm w-60'>
                  <p>This pet has no registered passport</p>
                  <p className='text-xs mt-1 opacity-80'>
                    Click to view details and update records
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <CardContent className='p-6'>
          <div className='flex items-center gap-4 mb-4'>
            <Avatar className={`h-16 w-16 ${pet.avatar.color}`}>
              <AvatarFallback className='text-white font-medium text-xl'>
                {pet.avatar.initials}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-foreground'>
                  {pet.name}
                </h2>
                {pet.sex && (
                  <div
                    className={`rounded-full p-1.5 ${
                      pet.sex === 'male'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : pet.sex === 'female'
                          ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {pet.sex === 'male' ? (
                      <Mars size={16} />
                    ) : pet.sex === 'female' ? (
                      <Venus size={16} />
                    ) : null}
                  </div>
                )}
              </div>
              <p className='text-muted-foreground'>
                {pet.breed || pet.species}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary/10 text-primary p-1 rounded-full'>
                <CalendarCheck size={14} />
              </div>
              <span className='text-sm'>{pet.age}</span>
            </div>

            {pet.colors && pet.colors.length > 0 && (
              <div className='flex items-center gap-2 flex-wrap'>
                {pet.colors.slice(0, 3).map((color, i) => (
                  <Badge
                    key={i}
                    variant='outline'
                    className='capitalize text-xs font-medium px-2 py-0.5 border-primary/20 text-primary'
                  >
                    {color}
                  </Badge>
                ))}
                {pet.colors.length > 3 && (
                  <span className='text-xs text-muted-foreground'>
                    +{pet.colors.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            {pet.lastVaccination ? (
              <div
                className={`rounded-lg p-3 border ${
                  pet.lastVaccination.isExpired
                    ? 'border-destructive/30 bg-destructive/10'
                    : 'border-border bg-card/60'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <ShieldCheck className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium'>
                      Latest vaccination
                    </span>
                  </div>
                  <Badge
                    variant={
                      pet.lastVaccination.isExpired ? 'destructive' : 'outline'
                    }
                    className='text-xs'
                  >
                    {pet.lastVaccination.isExpired ? 'Expired' : 'Valid'}
                  </Badge>
                </div>
                <div className='mt-1 text-sm'>
                  <span className='text-muted-foreground'>
                    {pet.lastVaccination.name} • Valid until{' '}
                    {format(
                      new Date(pet.lastVaccination.validUntil),
                      'MMM d, yyyy',
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className='rounded-lg p-3 border border-warning/30 bg-warning/10'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4 text-warning' />
                  <span className='text-sm font-medium'>No vaccinations</span>
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  No vaccination records found for this pet
                </div>
              </div>
            )}

            {!pet.lastVaccination && !pet.latestTreatment && (
              <div className='rounded-lg p-3 border border-destructive/30 bg-destructive/10'>
                <div className='flex items-center gap-2'>
                  <HeartPulse className='h-4 w-4 text-destructive' />
                  <span className='text-sm font-medium'>
                    Medical records needed
                  </span>
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  This pet has no vaccination or treatment records
                </div>
              </div>
            )}

            {pet.latestTreatment && pet.latestTreatment.isExpired && (
              <div className='rounded-lg p-3 border border-destructive/30 bg-destructive/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-destructive' />
                    <span className='text-sm font-medium'>
                      Treatment expired
                    </span>
                  </div>
                  <Badge variant='destructive' className='text-xs'>
                    Needs attention
                  </Badge>
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  {pet.latestTreatment.name} ({pet.latestTreatment.type}) •
                  Expired on{' '}
                  {format(
                    new Date(pet.latestTreatment.validUntil),
                    'MMM d, yyyy',
                  )}
                </div>
              </div>
            )}

            {pet.soonExpiring.length > 0 && (
              <div className='rounded-lg p-3 border border-warning/30 bg-warning/10'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-warning' />
                  <span className='text-sm font-medium'>Expiring soon</span>
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  {pet.soonExpiring[0].name} ({pet.soonExpiring[0].type}) •
                  Expires on {format(pet.soonExpiring[0].date, 'MMM d, yyyy')}
                  {pet.soonExpiring.length > 1 && (
                    <span> (+{pet.soonExpiring.length - 1} more)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
