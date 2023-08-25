import { schemaMigrations } from '../db/schemaMigrations';
import { dbIsReady, getPostgresConnection } from '../db/utils';

const main = async () => {
  const postgres = await getPostgresConnection();

  try {
    await dbIsReady(postgres, 1);
  } catch (e) {
    console.log('No instance of running database found. Skipping migrations.');
    return;
  }
  await schemaMigrations(postgres);
};

main()
  .then(() => process.exit(0))
  .catch(async e => {
    console.error(e);
    process.exit(1);
  });
