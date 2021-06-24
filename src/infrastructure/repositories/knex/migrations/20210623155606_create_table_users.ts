import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments('id')
    table.string('email')
    table.string('name')
    table.string('passwordHash')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}