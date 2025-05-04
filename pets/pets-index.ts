import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { antiParasiteTreatmentsTable } from '@passport/database/schema/anti-parasite-treatments';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
import { vaccinationsTable } from '@passport/database/schema/vaccinations';
import { getInitials } from '@passport/lib/pet/initials';
import { getSpeciesColor } from '@passport/lib/pet/utils';
import { getHumanReadeableAge } from '@passport/lib/utils';
import { addDays } from 'date-fns';
import { and, eq, or, sql } from 'drizzle-orm';

export async function fetchPets(userId: string) {
  const currentDate = new Date();
  const thirtyDaysLater = addDays(currentDate, 30);

  const currentDateStr = currentDate.toISOString().split('T')[0];
  const thirtyDaysLaterStr = thirtyDaysLater.toISOString().split('T')[0];

  const latestVaccinations = db
    .select({
      petId: vaccinationsTable.petId,
      name: vaccinationsTable.name,
      validUntil: vaccinationsTable.validUntil,

      isExpired:
        sql<boolean>`CASE WHEN ${vaccinationsTable.validUntil} < ${currentDateStr}::date THEN true ELSE false END`.as(
          'vax_is_expired',
        ),
      isExpiringSoon:
        sql<boolean>`CASE WHEN ${vaccinationsTable.validUntil} >= ${currentDateStr}::date AND ${vaccinationsTable.validUntil} <= ${thirtyDaysLaterStr}::date THEN true ELSE false END`.as(
          'vax_is_expiring_soon',
        ),
      rowNum:
        sql<number>`row_number() over (partition by ${vaccinationsTable.petId} order by ${vaccinationsTable.validUntil} desc)`.as(
          'vax_row_num',
        ),
    })
    .from(vaccinationsTable)

    .as('latest_vaccinations');

  const latestEchinococcus = db
    .select({
      petId: antiEchinococcusTreatmentsTable.petId,
      name: antiEchinococcusTreatmentsTable.name,
      validUntil: antiEchinococcusTreatmentsTable.validUntil,

      isExpired:
        sql<boolean>`CASE WHEN ${antiEchinococcusTreatmentsTable.validUntil} < ${currentDateStr}::date THEN true ELSE false END`.as(
          'echo_is_expired',
        ),
      isExpiringSoon:
        sql<boolean>`CASE WHEN ${antiEchinococcusTreatmentsTable.validUntil} >= ${currentDateStr}::date AND ${antiEchinococcusTreatmentsTable.validUntil} <= ${thirtyDaysLaterStr}::date THEN true ELSE false END`.as(
          'echo_is_expiring_soon',
        ),
      rowNum:
        sql<number>`row_number() over (partition by ${antiEchinococcusTreatmentsTable.petId} order by ${antiEchinococcusTreatmentsTable.validUntil} desc)`.as(
          'echo_row_num',
        ),
    })
    .from(antiEchinococcusTreatmentsTable)
    .as('latest_echinococcus');

  const latestParasites = db
    .select({
      petId: antiParasiteTreatmentsTable.petId,
      name: antiParasiteTreatmentsTable.name,
      validUntil: antiParasiteTreatmentsTable.validUntil,

      isExpired:
        sql<boolean>`CASE WHEN ${antiParasiteTreatmentsTable.validUntil} < ${currentDateStr}::date THEN true ELSE false END`.as(
          'para_is_expired',
        ),
      isExpiringSoon:
        sql<boolean>`CASE WHEN ${antiParasiteTreatmentsTable.validUntil} >= ${currentDateStr}::date AND ${antiParasiteTreatmentsTable.validUntil} <= ${thirtyDaysLaterStr}::date THEN true ELSE false END`.as(
          'para_is_expiring_soon',
        ),
      rowNum:
        sql<number>`row_number() over (partition by ${antiParasiteTreatmentsTable.petId} order by ${antiParasiteTreatmentsTable.validUntil} desc)`.as(
          'para_row_num',
        ),
    })
    .from(antiParasiteTreatmentsTable)
    .as('latest_parasites');

  const petsData = await db
    .select({
      id: petsTable.id,
      name: petsTable.name,
      species: petsTable.species,
      breed: petsTable.breed,
      sex: petsTable.sex,
      dob: petsTable.dob,
      colors: petsTable.colors,

      vaccinationName: latestVaccinations.name,
      vaccinationValidUntil: latestVaccinations.validUntil,
      vaccinationIsExpired: sql<boolean>`${latestVaccinations.isExpired}`,
      vaccinationIsExpiringSoon: sql<boolean>`${latestVaccinations.isExpiringSoon}`,

      echinococcusName: latestEchinococcus.name,
      echinococcusValidUntil: latestEchinococcus.validUntil,
      echinococcusIsExpired: sql<boolean>`${latestEchinococcus.isExpired}`,
      echinococcusIsExpiringSoon: sql<boolean>`${latestEchinococcus.isExpiringSoon}`,

      parasiteName: latestParasites.name,
      parasiteValidUntil: latestParasites.validUntil,
      parasiteIsExpired: sql<boolean>`${latestParasites.isExpired}`,
      parasiteIsExpiringSoon: sql<boolean>`${latestParasites.isExpiringSoon}`,
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

    .leftJoin(
      latestVaccinations,
      and(
        eq(petsTable.id, latestVaccinations.petId),
        eq(latestVaccinations.rowNum, 1),
      ),
    )

    .leftJoin(
      latestEchinococcus,
      and(
        eq(petsTable.id, latestEchinococcus.petId),
        eq(latestEchinococcus.rowNum, 1),
      ),
    )

    .leftJoin(
      latestParasites,
      and(
        eq(petsTable.id, latestParasites.petId),
        eq(latestParasites.rowNum, 1),
      ),
    )
    .where(eq(ownersTable.externalId, userId));

  return petsData.map((pet) => {
    const lastVaccination = pet.vaccinationValidUntil
      ? {
          name: pet.vaccinationName,
          validUntil: pet.vaccinationValidUntil,
          isExpired: pet.vaccinationIsExpired,
          isExpiringSoon: pet.vaccinationIsExpiringSoon,
        }
      : null;

    let latestTreatment = null;
    if (pet.echinococcusValidUntil && pet.parasiteValidUntil) {
      const echinoDate = new Date(pet.echinococcusValidUntil);
      const paraDate = new Date(pet.parasiteValidUntil);
      latestTreatment =
        echinoDate > paraDate
          ? {
              name: pet.echinococcusName,
              validUntil: pet.echinococcusValidUntil,
              type: 'echinococcus',
              isExpired: pet.echinococcusIsExpired,
              isExpiringSoon: pet.echinococcusIsExpiringSoon,
            }
          : {
              name: pet.parasiteName,
              validUntil: pet.parasiteValidUntil,
              type: 'parasite',
              isExpired: pet.parasiteIsExpired,
              isExpiringSoon: pet.parasiteIsExpiringSoon,
            };
    } else if (pet.echinococcusValidUntil) {
      latestTreatment = {
        name: pet.echinococcusName,
        validUntil: pet.echinococcusValidUntil,
        type: 'echinococcus',
        isExpired: pet.echinococcusIsExpired,
        isExpiringSoon: pet.echinococcusIsExpiringSoon,
      };
    } else if (pet.parasiteValidUntil) {
      latestTreatment = {
        name: pet.parasiteName,
        validUntil: pet.parasiteValidUntil,
        type: 'parasite',
        isExpired: pet.parasiteIsExpired,
        isExpiringSoon: pet.parasiteIsExpiringSoon,
      };
    }

    const hasExpiredVaccine = lastVaccination?.isExpired || false;
    const hasExpiredTreatment = latestTreatment?.isExpired || false;
    const needsAttention = hasExpiredVaccine || hasExpiredTreatment;

    const soonExpiring = [];
    if (lastVaccination?.isExpiringSoon) {
      soonExpiring.push({
        type: 'vaccination',
        name: lastVaccination.name,
        date: new Date(lastVaccination.validUntil),
      });
    }

    if (latestTreatment?.isExpiringSoon) {
      soonExpiring.push({
        type: latestTreatment.type,
        name: latestTreatment.name,
        date: new Date(latestTreatment.validUntil),
      });
    }

    const petAge = pet.dob ? getHumanReadeableAge(pet.dob) : 'Unknown age';

    const expiringVaccination = lastVaccination?.isExpiringSoon
      ? {
          id: pet.id,
          disease: lastVaccination.name,
          validUntil: new Date(lastVaccination.validUntil),
          daysUntilExpiration: Math.ceil(
            (new Date(lastVaccination.validUntil).getTime() -
              new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        }
      : null;

    const expiringParasiteTreatment =
      latestTreatment?.type === 'parasite' && latestTreatment.isExpiringSoon
        ? {
            id: pet.id,
            validUntil: new Date(latestTreatment.validUntil),
            daysUntilExpiration: Math.ceil(
              (new Date(latestTreatment.validUntil).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          }
        : null;

    const expiringEchinococcusTreatment =
      latestTreatment?.type === 'echinococcus' && latestTreatment.isExpiringSoon
        ? {
            id: pet.id,
            validUntil: new Date(latestTreatment.validUntil),
            daysUntilExpiration: Math.ceil(
              (new Date(latestTreatment.validUntil).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          }
        : null;

    return {
      ...pet,
      age: petAge,
      lastVaccination,
      latestTreatment,
      healthStatus: {
        needsAttention,
        hasExpiredVaccine,
        hasExpiredTreatment,
      },
      soonExpiring,
      avatar: {
        color: getSpeciesColor(pet.species),
        initials: getInitials(pet.name),
      },
      expiringVaccination,
      expiringParasiteTreatment,
      expiringEchinococcusTreatment,
    };
  });
}
