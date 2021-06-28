export default {
  development: {
    client: "pg",
    connection: `postgresql://${process.env.DBUSER}:${process.env.DBPASSWORD}@localhost:5432/postgres`,
    migrations: {
      directory: __dirname + '/src/infrastructure/repositories/knex/migrations'
    },
    // debug: true,
  }
}