'use client';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@passport/components/ui/sheet';
import { Menu, PawPrint, Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { PetQuickNavLinks } from './pet-quick-nav-links';
import { NavPet } from './types';
import { Button } from './ui/button';

export interface MobileNavSheetProps {
  pets: NavPet[];
}

export function MobileNavSheet({ pets }: MobileNavSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className='p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors'>
          <Menu size={20} />
          <span className='sr-only'>Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='flex flex-col w-[80vw] sm:max-w-sm p-0'
      >
        <div className='p-4 border-b flex items-center justify-between'>
          <div className='flex items-center'>
            <PawPrint size={16} className='text-primary mr-2' />
            <h3 className='font-semibold'>Passport</h3>
          </div>
          <Link href='/pets/add' onClick={handleClose}>
            <Button size='sm' className='h-8'>
              <Plus className='mr-1 h-3 w-3' />
              Add Pet
            </Button>
          </Link>
        </div>
        <div className='flex-1 overflow-auto p-4'>
          <nav className='space-y-6'>
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h4 className='text-sm font-medium'>My Pets</h4>
                <Link
                  href='/pets'
                  className='text-xs text-muted-foreground hover:text-primary'
                  onClick={handleClose}
                >
                  View all
                </Link>
              </div>
              <Suspense
                fallback={
                  <div className='text-xs text-muted-foreground'>
                    Loading pets...
                  </div>
                }
              >
                <PetQuickNavLinks onLinkClick={handleClose} pets={pets} />
              </Suspense>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
