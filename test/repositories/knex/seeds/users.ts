import { Knex } from "knex";
import User from "../../../../src/domain/models/user";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { 
            email: "thide2001@gmail.com",
            name: "Thiago",
            passwordHash: "$2b$10$uwXb31Igl9Uofo.eqvceGefkQCEQtw8MkL4MeX7UPimgw51ru98WG",
            // role: "administrator",
         } as User,
    ]);
};
