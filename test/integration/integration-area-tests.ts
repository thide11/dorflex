import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import { FakeObjects } from "../fixtures/fake-objects";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import { Knex } from "knex";
import RequesterKnexRepository from "../../src/infrastructure/repositories/knex/requester-knex-repository";
import ItemKnexRepository from "../../src/infrastructure/repositories/knex/item-knex-repository";
import SolicitationItemKnexRepository from "../../src/infrastructure/repositories/knex/solicitation-item-knex-repository";
import SolicitationKnexRepository from "../../src/infrastructure/repositories/knex/solicitation-knex-repository";
import CostCenterKnexRepository from "../../src/infrastructure/repositories/knex/cost-center-knex-repository";

export default function integrationAreaTests(knex : Knex, app : any, authToken : string) {
  const areaRepository = new AreaKnexRepository(knex);
  const requesterRepository = new RequesterKnexRepository(areaRepository, knex);
  const itemRepository = new ItemKnexRepository(knex);
  const solicitationItemRepository = new SolicitationItemKnexRepository(knex);
  const solicitationRepository = new SolicitationKnexRepository(solicitationItemRepository, knex);
  const costCenterRepository = new CostCenterKnexRepository(knex);

  describe("Deve testar o funcionamento da área", () => {
    describe("Funcoes de listagem", () => {
      test('GET /area without autentication', async () => {
          const response = await supertest(app)
            .get(`/area`)
              
          expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      })
      test('GET /area with autentication', async () => {
          const response = await supertest(app)
            .get(`/area`)
            .set("Authorization", `Bearer ${authToken}`);
              
          expect(response.statusCode).toEqual(StatusCodes.OK);
          expect(response.body).toEqual([
            FakeObjects.getTheFakeArea()
          ]);
      })
    })
    describe("Funcao de exibir um", () => {
      test('GET /area/:id expecting not found', async () => {
          await supertest(app)
            .get(`/area/20`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(StatusCodes.NOT_FOUND);
      })
      test('GET /area/:id expecting data', async () => {
        const areaAPesquisar = FakeObjects.getTheFakeArea();
        const response = await supertest(app)
          .get(`/area/${areaAPesquisar.code}`)
          .set("Authorization", `Bearer ${authToken}`);
    
        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(response.body).toEqual(areaAPesquisar);
      })
    })

    describe("Funcao de inserir um", () => {
      test("POST /area", async () => {
        const areaAInserir = FakeObjects.generateFakeArea();

        const response = await supertest(app)
          .post(`/area`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(areaAInserir);
        
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
        expect(response.body).toEqual(areaAInserir);
        const areas = await areaRepository.list();
        expect(areas.length).toBe(2);
      })
    });
    describe("Funcao de editar um", () => {
      test("PUT /area/:id", async () => {
        const areaEditada = FakeObjects.getTheFakeArea();

        areaEditada.solicitation_is_blocked = !areaEditada.solicitation_is_blocked;

        const response = await supertest(app)
          .put(`/area/${areaEditada.code}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(areaEditada);
        
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const areaNoBanco = await areaRepository.get(areaEditada.code);
        expect(areaNoBanco).toStrictEqual(areaEditada);
      })
    });
    describe("Funcao de deletar um", () => {
      test("DELETE /area/:id", async () => {
        const solicitationId = FakeObjects.getTheFakeSolicitation().id
        await solicitationRepository.delete(solicitationId);
        await costCenterRepository.delete(FakeObjects.getTheFakeCostCenter().code);
        await requesterRepository.delete(FakeObjects.getTheFakeRequester().id);
        await itemRepository.delete(FakeObjects.getTheFakeItem().sap_atena);

        const areaARemover = FakeObjects.getTheFakeArea();
        const response = await supertest(app)
          .delete(`/area/${areaARemover.code}`)
          .set("Authorization", `Bearer ${authToken}`)
        
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const areaNoBanco = await areaRepository.get(areaARemover.code);
        expect(areaNoBanco).toBeUndefined();
      })
    });
  });
}