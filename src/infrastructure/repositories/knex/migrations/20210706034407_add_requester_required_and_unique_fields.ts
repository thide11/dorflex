import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("requester", (table) => {
    table.string("name").notNullable().alter();
    table.string("area_name").notNullable().alter()
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("requester", (table) => {
    table.string("name").nullable().alter();
    table.string("area_name").nullable().alter();
  });
}

