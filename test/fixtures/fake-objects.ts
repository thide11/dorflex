import faker from "faker";
import Area from "../../src/domain/models/area";
import Requester from "../../src/domain/models/requester";
import User from "../../src/domain/models/user";
import Bcrypt from "../../src/infrastructure/crypt/bcrypt";
import Item from "../../src/domain/models/item";

export abstract class FakeObjects {
  static getTheFakeUser() {
    return { 
      id: 0,
      email: "thide2001@gmail.com",
      name: "Thiago",
      passwordHash: "$2b$10$uwXb31Igl9Uofo.eqvceGefkQCEQtw8MkL4MeX7UPimgw51ru98WG",
      role: "administrator",
    } as User
  }

  static async generateFakeUser(password : string) {
    return {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      passwordHash: await new Bcrypt().encrypt(password),
      role: "administrator",
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

  static getTheFakeRequester() {
    return {
      id: 10,
      name: "João Moura",
      area_name: this.getTheFakeArea().name,
    } as Requester
  }

  static generateFakeRequester() {
    return {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      area_name: faker.datatype.string(),
    } as Requester
  }
  static getTheFakeItem() {
    return {
      sap_atena: "BR550235235",
      sap_br: "GGERMJGEUNGE",
      family: "Cosméticos",
      area_name: this.getTheFakeArea().name,
      correction_factor: 10,
      description: "Este é um item falso",
      net_value: 0.001,
      blocked: false,
    } as Item
  }
  static generateFakeItem() {
    return {
      sap_atena: "BR550235235",
      sap_br: "GGERMJGEUNGE",
      family: faker.datatype.string(),
      blocked: faker.datatype.boolean(),
      area_name: this.getTheFakeArea().name,
      correction_factor: faker.datatype.number(100),
      description: faker.datatype.string(),
      net_value: faker.datatype.float(),
    } as Item
  }
}