'use client';

import { Button } from '@passport/components/ui/button';
import { cn } from '@passport/lib/utils';
import {
  BadgeMinus,
  BadgePlus,
  ScrollText,
  Shield,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';

type SectionInfo = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

interface PetSectionNavProps {
  petId: string;
  className?: string;
}

export function PetSectionNav({ petId, className }: PetSectionNavProps) {
  const currentHash = typeof window !== 'undefined' ? window.location.hash : '';

  const sections: SectionInfo[] = [
    { id: 'passport', label: 'Passport', icon: <ScrollText size={16} /> },
    { id: 'vaccinations', label: 'Vaccinations', icon: <Shield size={16} /> },
    {
      id: 'anti-echinococcus',
      label: 'Echinococcus',
      icon: <BadgeMinus size={16} />,
    },
    { id: 'anti-parasites', label: 'Parasites', icon: <BadgePlus size={16} /> },
    {
      id: 'examinations',
      label: 'Examinations',
      icon: <Stethoscope size={16} />,
    },
  ];

  return (
    <div className={cn('flex gap-4 justify-center pb-2 px-2', className)}>
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={currentHash === `#${section.id}` ? 'default' : 'outline'}
          size='sm'
          className='flex gap-1 whitespace-nowrap'
          asChild
        >
          <Link href={`/pets/${petId}#${section.id}`}>
            {section.icon}
            {section.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
