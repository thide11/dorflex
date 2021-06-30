import getKnexConnection from "../../src/infrastructure/repositories/knex/get-knex-connection";
import { runServer } from "../../src/infrastructure/server/server";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";

process.env.NODE_ENV = 'test';

const app = runServer();
const knex = getKnexConnection();

describe("Testes de crud do usuario", () => {
  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run()
        .then(() => {
          done();
        })
      });
    });
  });
  
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoaWRlMjAwMUBnbWFpbC5jb20iLCJleHBpcmF0aW9uVG9rZW4iOjE2MjQ1NjQzNDUxMzgsImlhdCI6MTYyNDU2NDM0MX0.ebqUfkXjyJijWEPwWVzcKclB040-isQ-3B6f6CxDxq0"

  test('POST /auth/login', async () => {
      const response = await supertest(app)
          .post('/auth/login').send({
            email: "thide2001@gmail.com",
            password: "test"
          });

      expect(response.statusCode).toEqual(200);
      const token = response.body.token;
      expect(token).not.toBeNull();
  })

  describe("Deve testar o funcionamento da área", () => {
    test('GET /area without autentication', async () => {
        const response = await supertest(app)
            .get(`/area`)
            
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
    test('GET /area', async () => {
        const response = await supertest(app)
            .get(`/area`)
            .set("Authorization", `Bearer ${authToken}`);
            
        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(response.body).toEqual([]);
    })
    test('GET /area/10', async () => {
        const response = await supertest(app)
            .get(`/area`)
            .set("Authorization", `Bearer ${authToken}`);
  
        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(response.body).toEqual([]);
    })
  });

  afterEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      done();
    });
  });
});