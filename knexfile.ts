import getEnvOrReturnError from "./src/infrastructure/server/utils/get-env-or-return-error";

export default {
  development: {
    client: "pg",
    version: "13.3",
    connection: `postgresql://${process.env.DBUSER ?? "postgres"}:${process.env.DBPASSWORD ?? "123"}@127.0.0.1:5432/postgres`,
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  },
  test: {
    client: "pg",
    version: "13.3",
    connection: {
      host: getEnvOrReturnError("POSTGRES_HOST"),
      port: 5432,
      user: getEnvOrReturnError("POSTGRES_USER"),
      password: getEnvOrReturnError("POSTGRES_PASSWORD"),
      database: getEnvOrReturnError("POSTGRES_DB"),
    },
    seeds: {
      directory: __dirname + '/test/repositories/knex/seeds'
    },
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  },
}