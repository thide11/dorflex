import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTable(`solicitation_item`)
  await knex.schema.dropTable(`solicitation`)
  await knex.schema.createTable('solicitation', (table) => {
      table.increments("id")
      table.integer("user_id")
      table.dateTime("created_date")
      table.integer("requester_id")
      table.string("order_number")
      table.integer("cost_center_code")
      table.foreign("user_id").references("id").inTable("users")
      table.foreign("requester_id").references("id").inTable("requester")
      table.foreign("cost_center_code").references("code").inTable("cost_center")
  })
  await knex.schema.createTable(`solicitation_item`, (table) => {
      table.integer('solicitation_id')
      table.integer('amount')
      table.integer("integer_limit_id")
      table.foreign("solicitation_id").references("id").inTable("solicitation");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(`solicitation_item`)
  await knex.schema.dropTable(`solicitation`)
  await knex.schema.createTable('solicitation', (table) => {
      table.increments("id").primary()
      table.integer("user_id")
      table.dateTime("created_date")
      table.integer("requester_id")
      table.string("order_number")
      table.integer("cost_center_code")
      table.foreign("user_id").references("id").inTable("users")
      table.foreign("requester_id").references("id").inTable("requester")
      table.foreign("cost_center_code").references("code").inTable("cost_center")
  })
  await knex.schema.createTable(`solicitation_item`, (table) => {
      table.integer('solicitation_id')
      table.integer('amount')
      table.integer("integer_limit_id")
      table.foreign("solicitation_id").references("id").inTable("solicitation");
  });
}

