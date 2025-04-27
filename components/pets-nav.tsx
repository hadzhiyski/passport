import { SidebarGroup, SidebarMenu } from '@passport/components/ui/sidebar';
import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
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
    .innerJoin(passportsTable, eq(petsTable.id, passportsTable.petId))
    .leftJoin(
      ownersTable,
      or(
        eq(ownersTable.id, passportsTable.owner1Id),
        eq(ownersTable.id, passportsTable.owner2Id),
      ),
    )
    .where(eq(ownersTable.externalId, ownerId));

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
