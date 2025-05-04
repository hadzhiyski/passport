'use client';

import { getInitials } from '@passport/lib/pet/initials';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface PetNavItemProps {
  pet: {
    id: string;
    name: string;
  };
}

export default function PetNavItem({ pet }: PetNavItemProps) {
  const path = usePathname();
  const isActive =
    path === `/pets/${pet.id}` || path.startsWith(`/pets/${pet.id}/`);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/pets/${pet.id}`}>
          <Avatar
            className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
          >
            <AvatarFallback
              className={
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }
            >
              {getInitials(pet.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <div className='flex flex-col'>
          <span>{pet.name}</span>
          <span className='text-xs opacity-70'>Click to view details</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
