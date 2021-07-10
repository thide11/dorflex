import { Knex } from "knex";
import { FakeObjects } from "../../../fixtures/fake-objects";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert(FakeObjects.getTheFakeUser());
    await knex("area").insert(FakeObjects.getTheFakeArea());
    await knex("requester").insert(FakeObjects.getTheFakeRequester());
    await knex("itens").insert(FakeObjects.getTheFakeItem());
};
