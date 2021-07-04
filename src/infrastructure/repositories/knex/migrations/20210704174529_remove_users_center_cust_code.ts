import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("cust_center_code");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.integer("cust_center_code")
    table.foreign("cust_center_code").references("code").inTable("cost_center")
  });
}

