import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("cost_center", (table) => {
    table.integer("code").primary()
    table.string("description")
    table.string("area")
    table.foreign("area").references("name").inTable("area");
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("cost_center")
}

