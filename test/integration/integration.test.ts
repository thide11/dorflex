import dotenv from "dotenv";
dotenv.config();
dotenv.config({path: ".env.test"});
import getKnexConnection from "../../src/infrastructure/repositories/knex/get-knex-connection";
import { runServer } from "../../src/infrastructure/server/server";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import { FakeObjects } from "../fixtures/fake-objects";
import faker from "faker";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import performUserTests from "./integration-area-tests";
import integrationAreaTests from "./integration-area-tests";
import integrationAuthTests from "./integration-auth-tests";
import testToken from "../../src/infrastructure/utils/test-token";

process.env.NODE_ENV = 'test';


describe("Testes de crud do usuario", () => {
  const knex = getKnexConnection();
  const app = runServer(knex);
  const authToken = testToken();
  
  beforeEach(async () => {
    await knex.migrate.rollback()
    await knex.migrate.latest()
    await knex.seed.run();
  });

  integrationAreaTests(knex, app, authToken);
  integrationAuthTests(knex, app, authToken);
  

  afterEach(async () => {
    await knex.migrate.rollback()
  });

  afterAll(async () => {
    await knex.destroy();
  });
});