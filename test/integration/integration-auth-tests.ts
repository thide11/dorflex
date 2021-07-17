import { Knex } from "knex";
import supertest from "supertest";
import { FakeObjects } from "../fixtures/fake-objects";
import faker from "faker";
import UncryptedUser from "../../src/domain/models/uncrypted-user";
import { StatusCodes } from "http-status-codes";
import UserKnexRepository from "../../src/infrastructure/repositories/knex/user-knex-repository";

export default function integrationAuthTests(knex : Knex, app : any, authToken : string) {
  describe("Função de login", () => {
    test('POST /auth/login', async () => {
      const loginData = {
        email: "thide2001@gmail.com",
        password: "test"
      }
      const response = await supertest(app)
          .post('/auth/login').send(loginData);
  
      expect(response.statusCode).toEqual(200);
      const token = response.body.token;
      expect(token).not.toBeNull();
    })
  })

  describe("Função de cadastro de usuario", () => {
    test('POST /user without autentication', async () => {
      const password = faker.internet.password();
      const loginData = await FakeObjects.generateFakeUser(password);
      const response = await supertest(app)
          .post('/user').send(loginData);
  
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })

    test('POST /user with autentication', async () => {
      const password = faker.internet.password();
      // const loginData = await FakeObjects.generateFakeUser(password);
      const response = await supertest(app)
        .post('/user')
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "teste",
          email: "massa@gmail.com",
          password: password,
          role: "administrator",
        } as UncryptedUser
      );
  
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      const usuarioRepository = new UserKnexRepository(knex);
      const result = usuarioRepository.getByEmail("massa@gmail.com")
      expect(result).not.toBeUndefined();
    }, 10000)
  })
}