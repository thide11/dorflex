import faker from "faker";
import Area from "../../src/domain/models/area";
import User from "../../src/domain/models/user";
import Bcrypt from "../../src/infrastructure/crypt/bcrypt";

export abstract class FakeObjects {
  static getTheFakeUser() {
    return { 
      email: "thide2001@gmail.com",
      name: "Thiago",
      passwordHash: "$2b$10$uwXb31Igl9Uofo.eqvceGefkQCEQtw8MkL4MeX7UPimgw51ru98WG",
      // role: "administrator",
    } as User
  }

  static async generateFakeUser(password : string) {
    return {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      passwordHash: await new Bcrypt().encrypt(password),
    } as User
  }

  static getTheFakeArea() {
    return {
      code: 57568,
      name: "Injetáveis",
      solicitation_is_blocked: false,
    } as Area
  }

  static generateFakeArea() {
    return {
      code: faker.datatype.number(),
      name: faker.commerce.department(),
      solicitation_is_blocked: faker.datatype.boolean(),
    } as Area
  }
}