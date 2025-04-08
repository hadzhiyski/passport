import { SidebarGroup, SidebarMenu } from '@passport/components/ui/sidebar';
import { db } from '@passport/database';
import { ownerTable } from '@passport/database/schema/owner';
import { passportTable } from '@passport/database/schema/passport';
import { petsTable } from '@passport/database/schema/pet';
import { eq, or } from 'drizzle-orm';
import PetNavItem from './pets-nav-item';

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

  return pets.length > 0 ? (
    <SidebarGroup>
      <SidebarMenu>
        {pets.map((pet) => (
          <PetNavItem key={pet.id} pet={pet} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ) : null;
}
