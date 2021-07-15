import { Knex } from "knex";
import SolicitationItemKnexRepository from "../../../../src/infrastructure/repositories/knex/solicitation-item-knex-repository";
import SolicitationKnexRepository from "../../../../src/infrastructure/repositories/knex/solicitation-knex-repository";
import { FakeObjects } from "../../../fixtures/fake-objects";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert(FakeObjects.getTheFakeUser());
    await knex("area").insert(FakeObjects.getTheFakeArea());
    await knex("requester").insert(FakeObjects.getTheFakeRequester());
    await knex("itens").insert(FakeObjects.getTheFakeItem());
    await knex("cost_center").insert(FakeObjects.getTheFakeCostCenter());

    const solicitationItemRepository = new SolicitationItemKnexRepository(knex)
    const solicitationRepository = new SolicitationKnexRepository(solicitationItemRepository, knex);
    await solicitationRepository.insert(FakeObjects.getTheFakeSolicitation())

    //@ts-ignore
    // delete solicitation.itens
    // await knex("solicitation").insert(solicitation);
    // const solicitationItem = FakeObjects.getTheFakeSolicitationItem()
    // await knex("solicitation_item").insert(solicitationItem)
};