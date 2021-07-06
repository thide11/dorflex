import { Knex } from "knex";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";
import Requester from "../../../domain/models/requester";
import AreaRepository from "../../../domain/repositories/area-repository";
import RequesterRepository from "../../../domain/repositories/requester-repository";
import BaseKnexRepository from "./base-knex-repository";

export default class RequesterKnexRepository extends BaseKnexRepository<Requester> implements RequesterRepository {

  constructor(private areaRepository : AreaRepository, knex : Knex ) {
    super(knex);
  }
  protected getTableName(): string {
    return "requester";
  }
  protected getPrimaryKeyName(): string {
    return "id";
  }
  async insert(data: Requester): Promise<Requester> {
    const area = await this.areaRepository.getByName(data.area_name);
    if(area) {
      return super.insert(data);
    } else {
      throw new AppError(AppErrorCode.UNKNOWN_AREA_NAME);
    }
  }
}