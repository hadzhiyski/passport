'use client';

import { Button } from '@passport/components/ui/button';
import { cn } from '@passport/lib/utils';
import { Bug, Shield, Stethoscope, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash();

    window.addEventListener('hashchange', updateHash);
    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  const sections: SectionInfo[] = [
    { id: 'vaccinations', label: 'Vaccinations', icon: <Shield size={16} /> },
    {
      id: 'anti-echinococcus',
      label: 'Echinococcus',
      icon: <Zap size={16} />,
    },
    { id: 'anti-parasites', label: 'Parasites', icon: <Bug size={16} /> },
    {
      id: 'examinations',
      label: 'Examinations',
      icon: <Stethoscope size={16} />,
    },
  ];

  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-2 scrollbar-hide',
        className,
      )}
    >
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
