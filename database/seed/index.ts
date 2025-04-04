import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { join } from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { db } from '..';
import chalk from 'chalk';

dotenvExpand.expand(dotenv.config());

const cwd = join(process.cwd(), 'database', 'seed');

async function seed() {
  try {
    const files = await glob('./*.sql', {
      cwd,
    }).then((files) => files.sort());

    for (const file of files) {
      const path = join(cwd, file);
      const sql = await readFile(path, 'utf-8');

      await db.execute(sql);

      console.log(chalk.gray(`${file}`), '✅');
    }
    console.log(chalk.green('Seeding completed successfully.'));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('Seeding failed:'), error);
    process.exit(1);
  }
}

await seed();
