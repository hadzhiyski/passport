'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';

export interface PetNavItemProps {
  pet: {
    id: string;
    name: string;
  };
}

export default function PetNavItem({ pet }: PetNavItemProps) {
  const path = usePathname();
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
          <SidebarMenuSubButton asChild>
            <Link href={`/pets/${pet.id}#passport`}>Passport</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <Link href={`/pets/${pet.id}#vaccinations`}>Vaccinations</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <Link href={`/pets/${pet.id}#anti-echinococcus`}>
              Anti-Echinococcus Treatments
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <Link href={`/pets/${pet.id}#anti-parasites`}>
              Anti-Parasite Treatments
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <Link href={`/pets/${pet.id}#examinations`}>
              Clinical Examinations
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
