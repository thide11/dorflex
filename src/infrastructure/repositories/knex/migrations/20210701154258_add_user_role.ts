import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.enum("role", ["administrator", "warehouse", "commom"])
    table.integer("cust_center_code")
    table.foreign("cust_center_code").references("code").inTable("cost_center")
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumns("cust_center_code", "role");
  });
}