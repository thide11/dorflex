import AreaRepository from "../../../domain/repositories/area-repository";
import UserRepository from "../../../domain/repositories/user-repository";
import BaseKnexRepository from "./base-knex-repository";
import Area from "../../../domain/models/area";
import Validator from 'validatorjs';

export default class AreaKnexRepository extends BaseKnexRepository<Area> implements AreaRepository {
  getByName(areaName: string): Promise<Area | null> {
    return super.getKnexQuery().where("name", areaName).first()
  }

  protected getValidatorRules() : Validator.Rules {
    return {
      code: 'integer',
      name: 'string|required',
      solicitation_is_blocked: "boolean"
    }
  };

  protected getPrimaryKeyName() {
    return "code";
  }
  protected getTableName(): string {
    return "area";
  }
}