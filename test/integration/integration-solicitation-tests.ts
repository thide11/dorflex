
import { StatusCodes } from "http-status-codes";
import { Knex } from "knex";
import supertest from "supertest";
import Requester from "../../src/domain/models/requester";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import RequesterKnexRepository from "../../src/infrastructure/repositories/knex/requester-knex-repository";
import { FakeObjects } from "../fixtures/fake-objects";
import SolicitationKnexRepository from "../../src/infrastructure/repositories/knex/solicitation-knex-repository";
import SolicitationItemKnexRepository from "../../src/infrastructure/repositories/knex/solicitation-item-knex-repository";

export default function aintegrationSolicitationTests(knex : Knex, app : any, authToken : string) {
  // const baseEndpoint = "solicitation";
  // const solicitationItemRepository = new SolicitationItemKnexRepository(knex)
  // const solicitationRepository = new SolicitationKnexRepository(solicitationItemRepository, knex);
  // const exampleModel = FakeObjects.getTheFakeSolicitation();

  // const exampleGeneratedModel = FakeObjects.getTheFakeSolicitation();

  // describe("Deve testar o funcionamento da solicitacao", () => {
  //   describe("Funcoes de listagem", () => {
  //     test(`GET /${baseEndpoint} without autentication`, async () => {
  //         const response = await supertest(app)
  //           .get(`/${baseEndpoint}`)
              
  //         expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  //     })
  //     test(`GET /${baseEndpoint} with autentication`, async () => {
  //         const response = await supertest(app)
  //           .get(`/${baseEndpoint}`)
  //           .set("Authorization", `Bearer ${authToken}`);
              
  //         expect(response.statusCode).toEqual(StatusCodes.OK);
  //         response.body.forEach((element : any) => {
  //           delete element.created_date
  //         });

  //         let expectedModel = {...exampleModel}

  //         delete expectedModel.created_date;
  //         console.log(expectedModel)
  //         expect(response.body).toStrictEqual([
  //           exampleModel
  //         ]);
  //     })
  //   })

  //   describe("Funcao de exibir um", () => {
  //     test(`GET /${baseEndpoint}/:id expecting not found`, async () => {
  //         await supertest(app)
  //           .get(`/${baseEndpoint}/20`)
  //           .set("Authorization", `Bearer ${authToken}`)
  //           .expect(StatusCodes.NOT_FOUND);
  //     })

  //     test(`GET /${baseEndpoint}/:id expecting data`, async () => {
  //       //console.log(exampleModel)
  //       const modelDb = await solicitationRepository.get(10)
  //       console.log(modelDb)
        
        
  //       // .then(e => console.log(e))

  //       const response = await supertest(app)
  //         .get(`/${baseEndpoint}/${exampleModel.id}`)
  //         .set("Authorization", `Bearer ${authToken}`);
    
  //       expect(response.statusCode).toEqual(StatusCodes.OK);
  //       expect(response.body).toEqual(exampleModel);
  //     })
  //   })

  //   describe("Funcao de inserir um", () => {
  //     test(`POST /${baseEndpoint} com um nome de área inválido`, async () => {
  //       const response = await supertest(app)
  //         .post(`/${baseEndpoint}`)
  //         .set("Authorization", `Bearer ${authToken}`)
  //         .send(exampleGeneratedModel);
        
  //       expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  //     })

  //     test(`POST /${baseEndpoint} com um nome de área válido`, async () => {

  //       const response = await supertest(app)
  //         .post(`/${baseEndpoint}`)
  //         .set("Authorization", `Bearer ${authToken}`)
  //         .send(exampleGeneratedModel);
        
  //       expect(response.statusCode).toEqual(StatusCodes.CREATED);
  //       expect(response.body.id).toEqual(1);
  //       const list = await solicitationRepository.list();
  //       expect(list.length).toBe(2);
  //     })
  //   });
  // });
}