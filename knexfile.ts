export default {
  development: {
    client: "pg",
    connection: `postgresql://${process.env.DBUSER ?? "postgres"}:${process.env.DBPASSWORD ?? "123"}@127.0.0.1:5432/postgres`,
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  },
  test: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: 'postgres',
      password: '123',
      database: 'postgres'
    },
    seeds: {
      directory: __dirname + '/test/repositories/knex/seeds'
    },
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  },
}