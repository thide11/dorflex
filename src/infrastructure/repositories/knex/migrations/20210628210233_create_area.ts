import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("area", (table) => {
    table.integer("code")
    table.string("name").primary()
    table.boolean("solicitation_is_blocked")
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("area")
}