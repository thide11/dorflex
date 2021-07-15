import { Knex } from "knex"
import Item from "../../src/domain/models/item";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import { FakeObjects } from "../fixtures/fake-objects";
import ItemKnexRepository from "../../src/infrastructure/repositories/knex/item-knex-repository";

export default function integrationItemTests(knex : Knex, app : any, authToken : string) {

  const baseEndpoint = "item";
  const exampleModel = FakeObjects.getTheFakeItem();
  const exampleGeneratedModel = FakeObjects.generateFakeItem();
  const itemRepository = new ItemKnexRepository(knex);

  describe("Listagem de itens", () => {
    test('GET /item without autentication', async () => {
        const response = await supertest(app)
          .get(`/item`)
            
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
    
    test('GET /item with autentication', async () => {
      const response = await supertest(app)
        .get(`/item`)
        .set("Authorization", `Bearer ${authToken}`);
          
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([
        FakeObjects.getTheFakeItem()
      ]);
    })
  })

  describe("Função de exibir um", () => {
      test(`GET /${baseEndpoint}/:id expecting not found`, async () => {
          await supertest(app)
            .get(`/${baseEndpoint}/fakeSapAtena`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(StatusCodes.NOT_FOUND);
      })

      test(`GET /${baseEndpoint}/:id expecting data`, async () => {
        const response = await supertest(app)
          .get(`/${baseEndpoint}/${exampleModel.sap_atena}`)
          .set("Authorization", `Bearer ${authToken}`);
    
        expect(response.body).toEqual(exampleModel);
        expect(response.statusCode).toEqual(StatusCodes.OK);
      })
  })


  describe("Funcao de inserir um", () => {
    test(`POST /${baseEndpoint}`, async () => {
      const response = await supertest(app)
        .post(`/${baseEndpoint}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(exampleGeneratedModel);
      
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual(exampleGeneratedModel);
    })
  });

  describe("Funcao de editar um", () => {
    test(`PUT /${baseEndpoint}/:id com id inexistente`, async () => {
      const modelToEdit : Item = {...exampleModel};
      const response = await supertest(app)
        .put(`/${baseEndpoint}/idInexistente`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(modelToEdit);
      
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })

    test(`PUT /${baseEndpoint}/:id sem enviar data`, async () => {
      const response = await supertest(app)
        .put(`/${baseEndpoint}/fakeModel`)
        .set("Authorization", `Bearer ${authToken}`)
      
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })

    test(`PUT /${baseEndpoint}/:id com id válido`, async () => {
      const modelToEdit : Item = {...exampleModel};

      const antigoSapAtena = modelToEdit.sap_atena;
      modelToEdit.sap_atena = "novoSapAtena"

      const response = await supertest(app)
      .put(`/${baseEndpoint}/${antigoSapAtena}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(modelToEdit);
      
      expect(response.statusCode).toEqual(StatusCodes.OK);
      const model = await itemRepository.get(modelToEdit.sap_atena);
      expect(model).toStrictEqual(modelToEdit);
    })
  });

  describe("Funcao de deletar um", () => {
    test(`DELETE /${baseEndpoint}/:id com id inexistente`, async () => {
      const response = await supertest(app)
        .delete(`/${baseEndpoint}/FakeSapAtena`)
        .set("Authorization", `Bearer ${authToken}`)
      
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })

    test(`DELETE /${baseEndpoint}/:id com id válido`, async () => {
      const response = await supertest(app)
        .delete(`/${baseEndpoint}/${exampleModel.sap_atena}`)
        .set("Authorization", `Bearer ${authToken}`)
      
      expect(response.statusCode).toEqual(StatusCodes.OK);
      const model = await itemRepository.get(exampleModel.sap_atena);
      expect(model).toBeUndefined();
    })
  });

}