import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { eq, desc } from 'drizzle-orm';

export async function fetchAntiParasitesWithTotals(
  id: string,
  page: number | 'all',
  pageSize: number,
) {
  let treatments = db
    .select({
      id: antiEchinococcusTreatmentsTable.id,
      name: antiEchinococcusTreatmentsTable.name,
      manufacturer: antiEchinococcusTreatmentsTable.manufacturer,
      administeredOn: antiEchinococcusTreatmentsTable.administeredOn,
      administeredBy: veterinariansTable.name,
      validUntil: antiEchinococcusTreatmentsTable.validUntil,
    })
    .from(antiEchinococcusTreatmentsTable)
    .innerJoin(
      veterinariansTable,
      eq(antiEchinococcusTreatmentsTable.administeredBy, veterinariansTable.id),
    )
    .where(eq(antiEchinococcusTreatmentsTable.petId, id))
    .orderBy(desc(antiEchinococcusTreatmentsTable.administeredOn))
    .$dynamic();
  if (typeof page === 'number') {
    treatments = treatments.offset((page - 1) * pageSize).limit(pageSize);
  }
  return Promise.all([
    db.$count(
      antiEchinococcusTreatmentsTable,
      eq(antiEchinococcusTreatmentsTable.petId, id),
    ),
    treatments,
  ]).then(([total, treatments]) => ({
    total,
    treatments,
  }));
}
