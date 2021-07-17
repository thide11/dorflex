import faker from "faker";
import Area from "../../src/domain/models/area";
import Requester from "../../src/domain/models/requester";
import User from "../../src/domain/models/user";
import Bcrypt from "../../src/infrastructure/crypt/bcrypt";
import Item from "../../src/domain/models/item";
import Solicitation from "../../src/domain/models/solicitation"
import CostCenter from "../../src/domain/models/cost-center"
import SolicitationItem from "../../src/domain/models/solicitation-item";

export abstract class FakeObjects {

  static addId(object : any, id : number = 1) {
    const temp = {...object}
    temp.id = id
    return temp;
  }

  static getTheFakeUser() {
    return { 
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
      initial_stock: 100,
      price: 300.40,
      stock_code: "SAC325",
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
      initial_stock: faker.datatype.number(),
      price: faker.datatype.float(),
      stock_code: faker.datatype.string(10),
      sap_atena: faker.datatype.string(),
      sap_br: faker.datatype.string(),
      family: faker.datatype.string(),
      blocked: faker.datatype.boolean(),
      area_name: this.getTheFakeArea().name,
      correction_factor: faker.datatype.number(100),
      description: faker.datatype.string(),
      net_value: faker.datatype.float(),
    } as Item
  }

  static getTheFakeSolicitationItem() {
    //@ts-ignore
    return {
      amount: 2,
      item_limit_id: null,
    } as SolicitationItem
  }

  static getTheFakeCostCenter() {
    return {
      area: this.getTheFakeArea().name,
      code: 34502,
      description: "Area da bagunca",
    } as CostCenter
  }

  static generateFakeSolicitation() {
    return {
      cost_center_code: this.getTheFakeCostCenter().code,
      created_date: new Date(2000, 10, 20),
      id: faker.datatype.number(),
      order_number: faker.datatype.string(15),
      requester_id: 1,
      user_id: 1,
      itens: [
        this.getTheFakeSolicitationItem(),
      ],
    } as Solicitation
  }
  static getTheFakeSolicitation() {
    return {
      cost_center_code: this.getTheFakeCostCenter().code,
      created_date: new Date(2000, 10, 20),
      order_number: "242",
      requester_id: 1,
      user_id: 1,
      itens: [
        this.getTheFakeSolicitationItem(),
      ],
    } as Solicitation
  }
}