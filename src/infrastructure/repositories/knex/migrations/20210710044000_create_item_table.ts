import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("itens", (table) => {
    table.string("sap_atena").primary();
    table.string("sap_br");
    table.string("description");
    table.string("family");
    table.float("net_value");
    table.integer("correction_factor");
    
    table.boolean("blocked");
    table.string("area_name");
    table.foreign("area_name").references("name").inTable("area")
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("itens");
}

