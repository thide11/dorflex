import Requester from "../../../domain/models/requester";
import RequesterRepository from "../../../domain/repositories/requester-repository";
import BaseKnexRepository from "./base-knex-repository";

export default class RequesterKnexRepository extends BaseKnexRepository<Requester> implements RequesterRepository {
  protected getTableName(): string {
    return "requester";
  }
  protected getPrimaryKeyName(): string {
    return "id";
  }
}