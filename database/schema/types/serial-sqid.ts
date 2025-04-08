import { customType } from 'drizzle-orm/pg-core';
import Sqids from 'sqids';

const sqid = new Sqids({
  minLength: 8,
});

export const serialSqid = customType<{
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
      return sqid.encode([value]);
    }

    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      return sqid.encode([numberValue]);
    }

    throw new Error(`Invalid value for serialSqid. Value: ${value}`);
  },
});
