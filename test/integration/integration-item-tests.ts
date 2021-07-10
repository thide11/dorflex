import { Knex } from "knex"
import Item from "../../src/domain/models/item";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import { FakeObjects } from "../fixtures/fake-objects";

export default function integrationItemTests(knex : Knex, app : any, authToken : string) {
  describe("Função de login", () => {
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
}