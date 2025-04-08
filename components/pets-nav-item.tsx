'use client';

import Link from 'next/link';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { usePathname } from 'next/navigation';

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
          <SidebarMenuSubButton
            asChild
            isActive={path === `/pets/${pet.id}/vaccinations`}
          >
            <Link href={`/pets/${pet.id}/vaccinations`}>Vaccinations</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            isActive={path === `/pets/${pet.id}/treatments`}
          >
            <Link href={`/pets/${pet.id}/treatments`}>
              Anti-Parasite Treatments
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
