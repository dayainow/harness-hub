/**
 * Non-destructive description sync for the Harness table.
 *
 * Why this exists:
 *   `npx prisma db seed` wipes the DB before reseeding, which destroys real
 *   user data (bookmarks, reviews, collections). When we only need to refresh
 *   the curator-authored description / readmeExcerpt copy, we should do an
 *   UPDATE-only pass keyed by `slug` and leave everything else untouched.
 *
 * Data source:
 *   `prisma/harness-descriptions.generated.ts`, which is regenerated from
 *   `prisma/seed.ts` via `prisma/extract-descriptions.ts`. This keeps a single
 *   source of truth (seed.ts) without duplicating thousands of lines of
 *   Markdown across the codebase.
 *
 * Local usage:
 *   1. (Optional) regenerate from seed:
 *      npx ts-node prisma/extract-descriptions.ts
 *   2. Apply the updates against the configured DATABASE_URL:
 *      npm run update-descriptions
 *
 * Remote (Railway) usage:
 *   POST /api/harnesses/admin/sync-descriptions
 *   See HarnessesController.syncDescriptions for the equivalent code path.
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';

import { HARNESS_DESCRIPTIONS } from './harness-descriptions.generated';

// Match seed.ts: load .env.local with override so real credentials win over
// any placeholder values that may have leaked into .env.
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Check back/.env or back/.env.local.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const total = HARNESS_DESCRIPTIONS.length;
  let updated = 0;
  let missing = 0;
  const skipped: string[] = [];

  console.log(`Syncing descriptions for ${total} harnesses...`);

  for (const item of HARNESS_DESCRIPTIONS) {
    const result = await prisma.harness.updateMany({
      where: { slug: item.slug },
      data: {
        description: item.description,
        readmeExcerpt: item.readmeExcerpt,
      },
    });

    if (result.count > 0) {
      updated++;
      console.log(`  [${updated}/${total}] updated ${item.slug}`);
    } else {
      missing++;
      skipped.push(item.slug);
      console.log(`  [skip] no row for ${item.slug}`);
    }
  }

  console.log(
    `\nDone. Updated ${updated}/${total} harnesses (${missing} slugs not present in DB).`,
  );
  if (skipped.length > 0) {
    console.log(`Skipped slugs:\n  - ${skipped.join('\n  - ')}`);
  }
}

main()
  .catch((err) => {
    console.error('update-descriptions failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end().catch(() => undefined);
  });
