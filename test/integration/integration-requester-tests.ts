import { StatusCodes } from "http-status-codes";
import { Knex } from "knex";
import supertest from "supertest";
import Requester from "../../src/domain/models/requester";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import RequesterKnexRepository from "../../src/infrastructure/repositories/knex/requester-knex-repository";
import { FakeObjects } from "../fixtures/fake-objects";

export default function integrationRequesterTests(knex : Knex, app : any, authToken : string) {

  const baseEndpoint = "requester";
  const exampleModel = FakeObjects.getTheFakeRequester();
  const exampleGeneratedModel = FakeObjects.generateFakeRequester();

  describe("Deve testar o funcionamento da solicitante", () => {
    describe("Funcoes de listagem", () => {
      test('GET /requester without autentication', async () => {
          const response = await supertest(app)
            .get(`/${baseEndpoint}`)
              
          expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      })
      test('GET /requester with autentication', async () => {
          const response = await supertest(app)
            .get(`/${baseEndpoint}`)
            .set("Authorization", `Bearer ${authToken}`);
              
          expect(response.statusCode).toEqual(StatusCodes.OK);
          expect(response.body).toEqual([
            exampleModel
          ]);
      })
    })

    describe("Funcao de exibir um", () => {
      test(`GET /${baseEndpoint}/:id expecting not found`, async () => {
          await supertest(app)
            .get(`/${baseEndpoint}/20`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(StatusCodes.NOT_FOUND);
      })

      test(`GET /${baseEndpoint}/:id expecting data`, async () => {
        const response = await supertest(app)
          .get(`/${baseEndpoint}/${exampleModel.id}`)
          .set("Authorization", `Bearer ${authToken}`);
    
        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(response.body).toEqual(exampleModel);
      })
    })

    describe("Funcao de inserir um", () => {
      test(`POST /${baseEndpoint}`, async () => {

        const areaRepository = new AreaKnexRepository(knex)
        await areaRepository.insert({
          code: 241,
          name: exampleGeneratedModel.area_name,
          solicitation_is_blocked: false,
        })

        const response = await supertest(app)
          .post(`/${baseEndpoint}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(exampleGeneratedModel);
        
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
        const knexRepository = new RequesterKnexRepository(knex);
        const list = await knexRepository.list();
        expect(list.length).toBe(2);
        expect(list[1]).toStrictEqual(exampleGeneratedModel);
      })
    });

    describe("Funcao de editar um", () => {
      test(`PUT /${baseEndpoint}/:id`, async () => {
        const modelToEdit : Requester = JSON.parse(JSON.stringify(exampleModel));

        modelToEdit.name = "newName"

        const response = await supertest(app)
          .put(`/${baseEndpoint}/${modelToEdit.id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(modelToEdit);
        
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const requesterRepository = new RequesterKnexRepository(knex);
        const model = await requesterRepository.get(modelToEdit.id);
        expect(model).toStrictEqual(modelToEdit);
      })
    });

    describe("Funcao de deletar um", () => {
      test(`DELETE /${baseEndpoint}/:id`, async () => {
        const response = await supertest(app)
          .delete(`/${baseEndpoint}/${exampleModel.id}`)
          .set("Authorization", `Bearer ${authToken}`)
        
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const requesterRepository = new RequesterKnexRepository(knex);
        const model = await requesterRepository.get(exampleModel.id);
        expect(model).toBeUndefined();
      })
    });


  });
}