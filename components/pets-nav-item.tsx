'use client';

import Link from 'next/link';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { useHashState } from '@passport/hooks/use-hash';
import { usePathname } from 'next/navigation';

export interface PetNavItemProps {
  pet: {
    id: string;
    name: string;
  };
}

export default function PetNavItem({ pet }: PetNavItemProps) {
  const path = usePathname();
  const [hash] = useHashState();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className='font-medium'
        isActive={path === `/pets/${pet.id}`}
      >
        <Link href={`/pets/${pet.id}`}>{pet.name}</Link>
      </SidebarMenuButton>
      <SidebarMenuSub className='ml-0 border-l-0 px-1.5'>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            isActive={path === `/pets/${pet.id}` && hash === 'passport'}
          >
            <Link href={`/pets/${pet.id}#passport`}>Passport</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            isActive={path === `/pets/${pet.id}` && hash === 'vaccinations'}
          >
            <Link href={`/pets/${pet.id}#vaccinations`}>Vaccinations</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            isActive={
              path === `/pets/${pet.id}` && hash === 'anti-echinococcus'
            }
          >
            <Link href={`/pets/${pet.id}#anti-echinococcus`}>
              Anti-Echinococcus Treatments
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            isActive={path === `/pets/${pet.id}` && hash === 'anti-parasites'}
          >
            <Link href={`/pets/${pet.id}#anti-parasites`}>
              Anti-Parasite Treatments
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            isActive={path === `/pets/${pet.id}` && hash === 'examinations'}
          >
            <Link href={`/pets/${pet.id}#examinations`}>
              Clinical Examinations
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
