import { antiParasiteTreatments } from './anti-parasite-treatments';
import { examinations } from './examinations';
import { others } from './others';
import { owners } from './owners';
import { passports } from './passports';
import { petMarkings } from './pet-markings';
import { pets } from './pets';
import { vaxes } from './vaxes';
import { vets } from './vets';

export const PASSPORT_SCHEMA = {
  antiParasiteTreatments,
  examinations,
  others,
  owners,
  passports,
  petMarkings,
  pets,
  vaxes,
  vets,
} as const;
