const { DataSource } = require('typeorm');
require('dotenv').config();

async function runMigrations() {
  console.log('Starting database migrations...');
  console.log('Database connection info:', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB
  });
  
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: false,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      migrationsTableName: 'migrations',
      logging: true,
    });

    console.log('Initializing data source...');
    await dataSource.initialize();
    console.log('Data source initialized, running migrations...');
    
    const migrations = await dataSource.runMigrations({ transaction: 'all' });
    console.log(`Migrations completed successfully: ${migrations.length} migrations applied`);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();