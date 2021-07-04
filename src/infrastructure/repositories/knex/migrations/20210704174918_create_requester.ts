import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("requester", (table) => {
    table.increments("id").primary()
    table.string("name")
    table.string("area_name")
    table.foreign("area_name").references("name").inTable("area")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("requester");
}

