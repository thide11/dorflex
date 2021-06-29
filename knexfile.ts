export default {
  development: {
    client: "pg",
    connection: `postgresql://${process.env.DBUSER ?? "postgres"}:${process.env.DBPASSWORD ?? "123"}@localhost:5432/postgres`,
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
  }
}