import AreaRepository from "../../../domain/repositories/area-repository";
import UserRepository from "../../../domain/repositories/user-repository";
import BaseKnexRepository from "./base-knex-repository";
import Area from "../../../domain/models/area";
import Validator from 'validatorjs';
import AreaMontlyInfoRepository from "../../../domain/repositories/area-montly-info-repository";
import AreaMontlyInfo from "../../../domain/models/area-montly-info";

export default class AreaMontlyInfoKnexRepository extends BaseKnexRepository<AreaMontlyInfo> implements AreaMontlyInfoRepository {
  protected getValidatorRules() : Validator.Rules {
    return {      
    }
  };

  protected getPrimaryKeyName() {
    return "month";
  }
  protected getTableName(): string {
    return "area_montly_info";
  }

  runInsertTransaction(data : []) {
    // this.knex().transacting(trx, () => {
      


    // })
  }
}