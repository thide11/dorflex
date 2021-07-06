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
  const areaRepository = new AreaKnexRepository(knex);
  const requesterRepository = new RequesterKnexRepository(areaRepository, knex);

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
      test(`POST /${baseEndpoint} com um nome de área inválido`, async () => {
        const response = await supertest(app)
          .post(`/${baseEndpoint}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(exampleGeneratedModel);
        
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      })

      test(`POST /${baseEndpoint} com um nome de área válido`, async () => {
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
        expect(response.body.name).toEqual(exampleGeneratedModel.name);
        expect(response.body.id).toEqual(1);
        const list = await requesterRepository.list();
        expect(list.length).toBe(2);
        expect(list[1].name).toStrictEqual(exampleGeneratedModel.name);
      })
    });

    describe("Funcao de editar um", () => {
      test(`PUT /${baseEndpoint}/:id com id inexistente`, async () => {
        const modelToEdit : Requester = {...exampleModel};
        modelToEdit.id = 56;

        const response = await supertest(app)
          .put(`/${baseEndpoint}/${modelToEdit.id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(modelToEdit);
        
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      })

      test(`PUT /${baseEndpoint}/:id sem enviar data`, async () => {
        const modelToEdit : Requester = {...exampleModel};

        const response = await supertest(app)
          .put(`/${baseEndpoint}/${modelToEdit.id}`)
          .set("Authorization", `Bearer ${authToken}`)
        
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      })

      test(`PUT /${baseEndpoint}/:id com id válido`, async () => {
        const modelToEdit : Requester = {...exampleModel};

        modelToEdit.name = "newName"

        const response = await supertest(app)
          .put(`/${baseEndpoint}/${modelToEdit.id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(modelToEdit);
        
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const model = await requesterRepository.get(modelToEdit.id);
        expect(model).toStrictEqual(modelToEdit);
      })
    });

    describe("Funcao de deletar um", () => {
      test(`DELETE /${baseEndpoint}/:id com id inexistente`, async () => {
        const response = await supertest(app)
          .delete(`/${baseEndpoint}/${exampleModel.id+1}`)
          .set("Authorization", `Bearer ${authToken}`)
        
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      })

      test(`DELETE /${baseEndpoint}/:id com id válido`, async () => {
        const response = await supertest(app)
          .delete(`/${baseEndpoint}/${exampleModel.id}`)
          .set("Authorization", `Bearer ${authToken}`)
        
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const model = await requesterRepository.get(exampleModel.id);
        expect(model).toBeUndefined();
      })
    });


  });
}