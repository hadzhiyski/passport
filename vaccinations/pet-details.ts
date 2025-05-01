import { db } from '@passport/database';
import { vaccinationsTable } from '@passport/database/schema/vaccinations';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { desc, eq } from 'drizzle-orm';

export async function fetchVaccinationsWithTotals(
  id: string,
  page: number | 'all',
  pageSize: number,
) {
  let vaccinations = db
    .select({
      id: vaccinationsTable.id,
      name: vaccinationsTable.name,
      manufacturer: vaccinationsTable.manufacturer,
      lotNumber: vaccinationsTable.lotNumber,
      expiryDate: vaccinationsTable.expiryDate,
      administeredOn: vaccinationsTable.administeredOn,
      administeredBy: {
        id: veterinariansTable.id,
        name: veterinariansTable.name,
      },
      validFrom: vaccinationsTable.validFrom,
      validUntil: vaccinationsTable.validUntil,
      type: vaccinationsTable.type,
    })
    .from(vaccinationsTable)
    .innerJoin(
      veterinariansTable,
      eq(vaccinationsTable.administeredBy, veterinariansTable.id),
    )
    .where(eq(vaccinationsTable.petId, id))
    .orderBy(desc(vaccinationsTable.validUntil), desc(vaccinationsTable.id))
    .$dynamic();

  if (typeof page === 'number') {
    vaccinations = vaccinations.offset((page - 1) * pageSize).limit(pageSize);
  }
  return Promise.all([
    db.$count(vaccinationsTable, eq(vaccinationsTable.petId, id)),
    vaccinations,
  ]).then(([total, vaccinations]) => ({
    total,
    vaccinations,
  }));
}
