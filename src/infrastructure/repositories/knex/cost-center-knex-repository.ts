import CostCenter from "../../../domain/models/cost-center";
import CostCenterRepository from "../../../domain/repositories/cost-center-repository";
import BaseKnexRepository from "./base-knex-repository";

export default class CostCenterKnexRepository extends BaseKnexRepository<CostCenter> implements CostCenterRepository {
  protected getValidatorRules() : Validator.Rules {
    return {
      area: 'string|required',
      description: 'string',
    }
  };
  protected getPrimaryKeyName() {
    return "code";
  }
  protected getTableName(): string {
    return "cost_center";
  }
}