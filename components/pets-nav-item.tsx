'use client';

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

// Helper function to get initials from pet name
function getInitials(name: string): string {
  const nameParts = name.split(' ');

  if (nameParts.length === 1) {
    // For single name pets, take first two characters
    return name.substring(0, 2).toUpperCase();
  } else {
    // For multiple name pets, take first letter of each part
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2); // Limit to 2 characters
  }
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
