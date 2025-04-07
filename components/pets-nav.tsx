import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@passport/components/ui/sidebar';
import { db } from '@passport/database';
import { ownerTable } from '@passport/database/schema/owner';
import { passportTable } from '@passport/database/schema/passport';
import { petsTable } from '@passport/database/schema/pet';
import { eq, or } from 'drizzle-orm';
import { Bug, Syringe } from 'lucide-react';
import Link from 'next/link';

export interface PetsNavProps {
  ownerId: string;
}

export async function PetsNav({ ownerId }: PetsNavProps) {
  const pets = await db
    .select({
      id: petsTable.id,
      name: petsTable.name,
    })
    .from(petsTable)
    .innerJoin(passportTable, eq(petsTable.id, passportTable.petId))
    .leftJoin(
      ownerTable,
      or(
        eq(ownerTable.id, passportTable.owner1Id),
        eq(ownerTable.id, passportTable.owner2Id),
      ),
    )
    .where(eq(ownerTable.externalId, ownerId));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Pets</SidebarGroupLabel>
      <SidebarMenu className='gap-2'>
        {pets.map((pet) => (
          <SidebarMenuItem key={pet.name}>
            <SidebarMenuButton asChild>
              <Link href={`/pets/${pet.id}`} className='font-medium'>
                {pet.name}
              </Link>
            </SidebarMenuButton>
            <SidebarMenuSub className='ml-0 border-l-0 px-1.5'>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link href={`/pets/${pet.id}/vaccinations`}>
                    <div className='flex gap-1 items-center'>
                      <Syringe /> Vaccinations
                    </div>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link href={`/pets/${pet.id}/echinococcus`}>
                    <div className='flex gap-1 items-center'>
                      <Bug /> Anti-Parasite Treatments
                    </div>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
