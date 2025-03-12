export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'p@assword',
    db: process.env.POSTGRES_DB || 'mydb',
  },
  isDevelopment: process.env.NODE_ENV !== 'production',
});
