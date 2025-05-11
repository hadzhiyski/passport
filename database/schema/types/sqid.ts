import { customType } from 'drizzle-orm/pg-core';
import Sqids from 'sqids';

const sqid = new Sqids({
  minLength: 8,
});

type SQID_TABLE =
  | 'pets'
  | 'passports'
  | 'veterinarians'
  | 'owners'
  | 'anti_echinococcus_treatments'
  | 'anti_parasite_treatments'
  | 'clinical_examinations'
  | 'vaccinations';

const TABLE_MAPPING: Record<SQID_TABLE, number> = {
  pets: 100_000,
  passports: 200_000,
  veterinarians: 300_000,
  owners: 400_000,
  anti_echinococcus_treatments: 500_000,
  anti_parasite_treatments: 600_000,
  clinical_examinations: 700_000,
  vaccinations: 800_000,
};

export function serialSqid(table: SQID_TABLE) {
  const prefix = TABLE_MAPPING[table];
  return customType<{
    data: string;
    notNull: true;
    default: true;
  }>({
    dataType() {
      return 'serial';
    },
    toDriver(value: string): number {
      const [val, check] = sqid.decode(value);
      if (check !== prefix) {
        throw new Error(
          `Invalid SQID prefix. Expected: ${prefix}, got: ${check}`,
        );
      }
      return val;
    },
    fromDriver(value: unknown): string {
      if (typeof value === 'number') {
        return sqid.encode([value, prefix]);
      }

      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        return sqid.encode([numberValue, prefix]);
      }

      throw new Error(`Invalid value for serialSqid. Value: ${value}`);
    },
  })();
}

function integerSqidInternal<T extends { notNull: boolean; default: boolean }>(
  table: SQID_TABLE,
) {
  const prefix = TABLE_MAPPING[table];
  return customType<{
    data: string;
    notNull: T['notNull'];
    default: T['default'];
  }>({
    dataType() {
      return 'integer';
    },
    toDriver(value: string): number {
      const [val, check] = sqid.decode(value);
      if (check !== prefix) {
        throw new Error(
          `Invalid SQID prefix. Expected: ${prefix}, got: ${check}`,
        );
      }
      return val;
    },
    fromDriver(value: unknown): string {
      if (typeof value === 'number') {
        return sqid.encode([value, prefix]);
      }

      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        return sqid.encode([numberValue, prefix]);
      }

      throw new Error(`Invalid value for integerSqid. Value: ${value}`);
    },
  })();
}

export const integerSqid = integerSqidInternal<{
  notNull: true;
  default: false;
}>;
export const integerSqidNullable = integerSqidInternal<{
  notNull: false;
  default: false;
}>;
