import dotenv from "dotenv";
dotenv.config({path: ".env.test"});
import getKnexConnection from "../../src/infrastructure/repositories/knex/get-knex-connection";
import { runServer } from "../../src/infrastructure/server/server";
import integrationAreaTests from "./integration-area-tests";
import integrationAuthTests from "./integration-auth-tests";
import testToken from "../../src/infrastructure/utils/test-token";
import integrationRequesterTests from "./integration-requester-tests";
import integrationImportTests from "./integration-import-tests";
import integrationItemTests from "./integration-item-tests";
import integrationSolicitationTests from "./integration-solicitation-tests";

process.env.NODE_ENV = 'test';

describe("Testes de crud do usuario", () => {
  const knex = getKnexConnection();
  const app = runServer(knex);
  const authToken = testToken();
  
  beforeAll(async () => {
    await knex.migrate.rollback()
  })

  beforeEach(async () => {
    await knex.migrate.latest()
    await knex.seed.run();
  });

  integrationSolicitationTests(knex, app, authToken);
  integrationImportTests(knex, app, authToken);
  integrationAreaTests(knex, app, authToken);
  integrationAuthTests(knex, app, authToken);
  integrationRequesterTests(knex, app, authToken);
  integrationItemTests(knex, app, authToken);

  afterEach(async () => {
    await knex.migrate.rollback()
  });

  afterAll(async () => {
    await knex.destroy();
  });
});