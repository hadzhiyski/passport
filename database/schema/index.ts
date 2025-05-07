import { antiEchinococcusTreatmentsTable } from './anti-echinococcus-treatments';
import { antiParasiteTreatmentsTable } from './anti-parasite-treatments';
import { clinicalExaminationsTable } from './clinical-examinations';
import { ownersTable } from './owners';
import { passportsTable } from './passports';
import { petMarkingsTable } from './pet-markings';
import { petsTable } from './pets';
import { userOnboardingTable } from './user-onboarding';
import { vaccinationsTable } from './vaccinations';
import { veterinariansTable } from './veterinarians';

export const schema = {
  antiEchinococcusTreatmentsTable,
  antiParasiteTreatmentsTable,
  clinicalExaminationsTable,
  ownersTable,
  passportsTable,
  petMarkingsTable,
  petsTable,
  userOnboardingTable,
  vaccinationsTable,
  veterinariansTable,
} as const;
