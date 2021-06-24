export default {
  development: {
    client: "pg",
    connection: "postgresql://postgres:123@localhost:5432/postgres",
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
    // debug: true,
  }
}