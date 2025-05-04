'use client';

import {
  Bug,
  ChevronDown,
  PawPrint,
  Stethoscope,
  Syringe,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { NavPet } from './types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

const MAX_VISIBLE_PETS = 5;

interface PetNavEntriesProps {
  pets: NavPet[];
  onLinkClick?: () => void;
}

export function PetNavEntries({ pets, onLinkClick }: PetNavEntriesProps) {
  return (
    <ul className='space-y-1'>
      {pets.slice(0, MAX_VISIBLE_PETS).map((pet) => (
        <PetNavEntry key={pet.id} pet={pet} onLinkClick={onLinkClick} />
      ))}
      {pets.length > MAX_VISIBLE_PETS && (
        <li className='pt-1'>
          <Link
            href='/pets'
            className='block text-xs text-muted-foreground hover:text-primary text-right pr-2'
            onClick={onLinkClick}
          >
            See all pets
          </Link>
        </li>
      )}
    </ul>
  );
}

// Client component for interactive pet navigation entries
function PetNavEntry({
  pet,
  onLinkClick,
}: {
  pet: NavPet;
  onLinkClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={pet.id} className='rounded-md'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full'>
        <CollapsibleTrigger asChild>
          <div className='flex items-center justify-between w-full px-2 py-1.5 cursor-pointer'>
            <div className='flex items-center'>
              <span className='font-medium text-sm'>{pet.name}</span>
              <span className='text-xs text-muted-foreground ml-1.5'>
                {pet.species}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className='ml-4 border-l-2 pl-2 py-1 space-y-1 text-xs'>
            <Link
              href={`/pets/${pet.id}`}
              className='flex items-center gap-2 py-1 hover:text-primary transition-colors'
              onClick={onLinkClick}
            >
              <PawPrint className='h-3 w-3' />
              Profile
            </Link>
            <Link
              href={`/pets/${pet.id}#vaccinations`}
              className='flex items-center gap-2 py-1 hover:text-primary transition-colors'
              onClick={onLinkClick}
            >
              <Syringe className='h-3 w-3' />
              Vaccinations
            </Link>
            <Link
              href={`/pets/${pet.id}#anti-echinococcus`}
              className='flex items-center gap-2 py-1 hover:text-primary transition-colors'
              onClick={onLinkClick}
            >
              <Zap className='h-3 w-3' />
              Anti-Echinococcus Treatments
            </Link>
            <Link
              href={`/pets/${pet.id}#anti-parasites`}
              className='flex items-center gap-2 py-1 hover:text-primary transition-colors'
              onClick={onLinkClick}
            >
              <Bug className='h-3 w-3' />
              Anti-Parasites Treatments
            </Link>
            <Link
              href={`/pets/${pet.id}#examinations`}
              className='flex items-center gap-2 py-1 hover:text-primary transition-colors'
              onClick={onLinkClick}
            >
              <Stethoscope className='h-3 w-3' />
              Examinations
            </Link>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}
