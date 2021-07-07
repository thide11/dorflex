import { Knex } from "knex";


export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("excel_uploads", (table) => {
    table.dateTime("date").primary()
    table.string("filename")
    table.string("result")
    table.integer("user_uploaded")
    table.foreign("user_uploaded").references("id").inTable("users")
  })
}


export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("excel_uploads")
}

