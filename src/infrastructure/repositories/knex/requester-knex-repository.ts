import { Knex } from "knex";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";
import Area from "../../../domain/models/area";
import Requester from "../../../domain/models/requester";
import AreaRepository from "../../../domain/repositories/area-repository";
import RequesterRepository from "../../../domain/repositories/requester-repository";
import BaseKnexRepository from "./base-knex-repository";
import faker from "faker";

export default class RequesterKnexRepository extends BaseKnexRepository<Requester> implements RequesterRepository {

  constructor(private areaRepository : AreaRepository, knex : Knex ) {
    super(knex);
  }

  protected getValidatorRules() : Validator.Rules {
    return {
      area_name: 'string|required',
      name: 'string|required',
      id: 'integer'
    }
  };

  protected getTableName(): string {
    return "requester";
  }
  protected getPrimaryKeyName(): string {
    return "id";
  }

  async forceInsert(data : Requester) : Promise<Requester> {
    if(!data.area_name) {
      throw new AppError(AppErrorCode.INVALID_DATA);
    }
    const area = await this.areaRepository.getByName(data.area_name);
    if(area) {
      return super.insert(data);
    } else {
      const newArea = {
        name: data.area_name,
        solicitation_is_blocked: false,
        code: faker.datatype.number(),
      } as Area
      await this.areaRepository.insert(newArea)
      return super.insert(data);
    }
  }

  async insert(data: Requester): Promise<Requester> {
    if(!data.area_name) {
      throw new AppError(AppErrorCode.INVALID_DATA);
    }
    const area = await this.areaRepository.getByName(data.area_name);
    if(area) {
      return super.insert(data);
    } else {
      throw new AppError(AppErrorCode.UNKNOWN_AREA_NAME, `Área ${data.area_name} não encontrada no banco de dados, favor cadastrar`);
    }
  }
}