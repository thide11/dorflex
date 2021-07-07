import getEnvOrReturnError from "./src/infrastructure/utils/get-env-or-return-error";

function getDefaultConfig() : any {
  return {
    client: "pg",
    version: "13.3",
    connection: {
      host: getEnvOrReturnError("POSTGRES_HOST"),
      port: 5432,
      user: getEnvOrReturnError("POSTGRES_USER"),
      password: getEnvOrReturnError("POSTGRES_PASSWORD"),
      database: getEnvOrReturnError("POSTGRES_DB"),
    },
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  }
}

export default {
  test: {
    ...getDefaultConfig(),
    seeds: {
      directory: __dirname + '/test/repositories/knex/seeds'
    },
  },
  development: getDefaultConfig(),
  production: getDefaultConfig(),
}