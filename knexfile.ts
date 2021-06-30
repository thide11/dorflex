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
    connection: `postgresql://${process.env.DBUSER ?? "postgres"}:${process.env.DBPASSWORD ?? "123"}@192.168.0.40:5432/test`,
    seeds: {
      directory: __dirname + '/test/repositories/knex/seeds'
    },
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  },
}