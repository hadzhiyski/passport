import { db } from '@passport/database';
import { clinicalExaminationsTable } from '@passport/database/schema/clinical-examinations';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { desc, eq } from 'drizzle-orm';

export async function fetchClinicalExaminationsWithTotals(
  id: string,
  page: number | 'all',
  pageSize: number,
) {
  let examinations = db
    .select({
      id: clinicalExaminationsTable.id,
      date: clinicalExaminationsTable.date,
      veterinarian: veterinariansTable.name,
    })
    .from(clinicalExaminationsTable)
    .innerJoin(
      veterinariansTable,
      eq(clinicalExaminationsTable.veterinarianId, veterinariansTable.id),
    )
    .where(eq(clinicalExaminationsTable.petId, id))
    .orderBy(desc(clinicalExaminationsTable.date))
    .$dynamic();

  if (typeof page === 'number') {
    examinations = examinations.offset((page - 1) * pageSize).limit(pageSize);
  }
  return Promise.all([
    db.$count(
      clinicalExaminationsTable,
      eq(clinicalExaminationsTable.petId, id),
    ),
    examinations,
  ]).then(([total, examinations]) => ({
    total,
    examinations,
  }));
}
