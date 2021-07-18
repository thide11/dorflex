import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments('id').primary()
    table.string('email').unique()
    table.string('name').notNullable()
    table.enum("role", ["administrator", "warehouse", "commom"])
    table.string('passwordHash').notNullable()
  })

  await knex.schema.createTable("area", (table) => {
    table.increments("code", { primaryKey: false })
    table.string("name").primary()
    table.boolean("solicitation_is_blocked").defaultTo(false);
  })

  await knex.schema.createTable("cost_center", (table) => {
    table.integer("code").primary()
    table.string("description").nullable()
    table.string("area").notNullable()
    table.string("manager")
    table.foreign("area").references("name").inTable("area");
  })

  await knex.schema.createTable("requester", (table) => {
    table.increments("id").primary()
    table.string("name").notNullable()
    table.string("area_name").notNullable()
    table.foreign("area_name").references("name").inTable("area")
  })

  await knex.schema.createTable("excel_uploads", (table) => {
    table.dateTime("date").primary()
    table.string("filename").nullable()
    table.string("result")
    table.integer("user_uploaded")
    table.string("type")
    table.foreign("user_uploaded").references("id").inTable("users")
  })

  await knex.schema.createTable("itens", (table) => {
    table.increments("id").primary();
    table.string("sap_atena")
    table.string("sap_br");
    table.string("description");
    table.float("net_value");
    table.string("family");
    table.string("area_name");
    table.boolean("blocked");
    table.float("price", 8, 2)
    table.string("stock_code")
    table.integer("initial_stock")
    table.integer("correction_factor")
    table.foreign("area_name").references("name").inTable("area")
  });

  await knex.schema.createTable("area_monthly_info", (table) => {
    table.increments("id")
    table.integer("year").notNullable()
    table.integer("month").notNullable()
    table.double("production_volume_load").nullable()
    table.double("real_production").nullable()
    table.string("area_name").notNullable();
    table.foreign("area_name").references("name").inTable("area")
  });

  await knex.schema.createTable("item_limit", (table) => {
    table.increments("id").primary()
    table.float("item_limit")
    table.integer("previous_saving").nullable()
    table.integer("area_monthly_info_id").notNullable();
    table.integer("item_id").notNullable()
    table.integer("current_stock").notNullable()
    table.foreign("item_id").references("id").inTable("itens")
    table.foreign("area_monthly_info_id").references("id").inTable("area_monthly_info")
  });

  await knex.schema.createTable('solicitation', (table) => {
    table.increments("id").primary()
    table.integer("user_id")
    table.dateTime("created_date")
    table.integer("requester_id")
    table.string("order_number")
    table.integer("cost_center_code").notNullable()
    table.string("manager_authorized_bypass_limit_name").nullable();

    table.foreign("user_id").references("id").inTable("users")
    table.foreign("requester_id").references("id").inTable("requester")
    table.foreign("cost_center_code").references("code").inTable("cost_center")
  })

  await knex.schema.createTable(`solicitation_item`, (table) => {
    table.increments('id').primary()
    table.integer('solicitation_id').notNullable()
    table.integer('amount').notNullable()
    table.integer("item_limit_id").notNullable()
    table.foreign("solicitation_id").references("id").inTable("solicitation");
    table.foreign("item_limit_id").references("id").inTable("item_limit");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("solicitation_item");
  await knex.schema.dropTable("solicitation");
  await knex.schema.dropTable("item_limit");
  await knex.schema.dropTable("area_monthly_info");
  await knex.schema.dropTable("itens");
  await knex.schema.dropTable("excel_uploads");
  await knex.schema.dropTable("requester");
  await knex.schema.dropTable("cost_center");
  await knex.schema.dropTable("area");
  await knex.schema.dropTable("users");
}

