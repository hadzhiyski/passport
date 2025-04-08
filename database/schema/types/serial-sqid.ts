import { customType } from 'drizzle-orm/pg-core';
import Sqids from 'sqids';

const sqid = new Sqids({
  minLength: 8,
});

type SQID_TABLE = 'pets' | 'passports' | 'veterinarians' | 'owners';

const TABLE_MAPPING: Record<SQID_TABLE, number> = {
  pets: 100_000,
  passports: 200_000,
  veterinarians: 300_000,
  owners: 400_000,
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
      return sqid.decode(value)[0];
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
