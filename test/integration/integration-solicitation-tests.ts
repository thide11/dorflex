
import { StatusCodes } from "http-status-codes";
import { Knex } from "knex";
import supertest from "supertest";
import Requester from "../../src/domain/models/requester";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import RequesterKnexRepository from "../../src/infrastructure/repositories/knex/requester-knex-repository";
import { FakeObjects } from "../fixtures/fake-objects";
import SolicitationKnexRepository from "../../src/infrastructure/repositories/knex/solicitation-knex-repository";
import SolicitationItemKnexRepository from "../../src/infrastructure/repositories/knex/solicitation-item-knex-repository";
import SolicitationItem from "../../src/domain/models/solicitation-item";
import Solicitation from "../../src/domain/models/solicitation";

export default function aintegrationSolicitationTests(knex : Knex, app : any, authToken : string) {
  const baseEndpoint = "solicitation";
  const solicitationItemRepository = new SolicitationItemKnexRepository(knex)
  const solicitationRepository = new SolicitationKnexRepository(solicitationItemRepository, knex);
  const exampleModel = FakeObjects.getTheFakeSolicitation();
  const exampleGeneratedModel = FakeObjects.generateFakeSolicitation();

  function removeUnpredictableKeys(element : any) {
    //@ts-ignore
    delete element.created_date
    element.itens = element.itens?.map((e : SolicitationItem) => {
      //@ts-ignore
      delete e.solicitation_id;
      return e;
    })
    return element
  }

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

  //         let expectedModel = {...exampleModel}

  //         //@ts-ignore
  //         delete expectedModel.created_date;

  //         const responseFiltered = response.body.map(removeUnpredictableKeys)

  //         expect(
  //           responseFiltered
  //         ).toEqual([
  //           expectedModel
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
  //       const expectedModel = await solicitationRepository.get(exampleModel.id)

  //       const response = await supertest(app)
  //       .get(`/${baseEndpoint}/${expectedModel.id}`)
  //       .set("Authorization", `Bearer ${authToken}`);
        
  //       expect(response.statusCode).toEqual(StatusCodes.OK);
  //       removeUnpredictableKeys(response.body)
  //       removeUnpredictableKeys(expectedModel)
  //       expect(response.body).toEqual(expectedModel);
  //     })
  //   })

  //   describe("Funcao de inserir um", () => {
  //     test(`POST /${baseEndpoint} com um nome de solicitante inválido`, async () => {
  //       const modelWithInvalidRequester = {...exampleGeneratedModel}
  //       modelWithInvalidRequester.requester_id = 60;
  //       const response = await supertest(app)
  //         .post(`/${baseEndpoint}`)
  //         .set("Authorization", `Bearer ${authToken}`)
  //         .send(modelWithInvalidRequester);
        
  //       expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  //     })

  //     test(`POST /${baseEndpoint} com centro de custos inválido`, async () => {
  //       const modelWithInvalidCostCenter = {...exampleGeneratedModel}
  //       modelWithInvalidCostCenter.cost_center_code = 200;
  //       const response = await supertest(app)
  //         .post(`/${baseEndpoint}`)
  //         .set("Authorization", `Bearer ${authToken}`)
  //         .send(modelWithInvalidCostCenter);
        
  //       expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  //     })
      
  //     test(`POST /${baseEndpoint}`, async () => {
  //       const validModel = {...exampleGeneratedModel}

  //       const response = await supertest(app)
  //         .post(`/${baseEndpoint}`)
  //         .set("Authorization", `Bearer ${authToken}`)
  //         .send(validModel);
        
  //       const responseFiltered = removeUnpredictableKeys(response.body)
  //       expect(responseFiltered).toEqual(removeUnpredictableKeys(validModel));
  //       expect(response.statusCode).toEqual(StatusCodes.CREATED);
  //       const list = await solicitationRepository.list();
  //       expect(list.length).toBe(2);
  //     })
  //   });
  // });
}