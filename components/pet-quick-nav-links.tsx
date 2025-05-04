'use client';

import Link from 'next/link';
import { PetNavEntries } from './pet-nav-entries';

export interface PetQuickNavLinksProps {
  pets: Array<{ id: string; name: string; species: string }>;
  onLinkClick?: () => void;
}

export function PetQuickNavLinks({ pets, onLinkClick }: PetQuickNavLinksProps) {
  if (pets.length === 0) {
    return (
      <div className='text-xs text-muted-foreground py-1'>
        No pets yet.{' '}
        <Link
          href='/pets/add'
          className='underline hover:text-primary'
          onClick={onLinkClick}
        >
          Add one
        </Link>
      </div>
    );
  }

  return <PetNavEntries pets={pets} onLinkClick={onLinkClick} />;
}
