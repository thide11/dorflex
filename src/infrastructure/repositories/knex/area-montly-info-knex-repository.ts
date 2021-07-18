import AreaRepository from "../../../domain/repositories/area-repository";
import UserRepository from "../../../domain/repositories/user-repository";
import BaseKnexRepository from "./base-knex-repository";
import Area from "../../../domain/models/area";
import Validator from 'validatorjs';
import AreaMontlyInfoRepository from "../../../domain/repositories/area-montly-info-repository";
import AreaMontlyInfo from "../../../domain/models/area-montly-info";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";

export default class AreaMontlyInfoKnexRepository extends BaseKnexRepository<AreaMontlyInfo> implements AreaMontlyInfoRepository {
  protected getValidatorRules() : Validator.Rules {
    return {      
    }
  };

  protected getPrimaryKeyName() {
    return "month";
  }
  protected getTableName(): string {
    return "area_monthly_info";
  }

  async runInsertTransaction(insertAreas : AreaMontlyInfo[]) {
    const trx = await this.knex.transaction()
    try {
      for (const area of insertAreas) {
        await trx(this.getTableName()).insert(area);
      }
    } catch (e) {
      await trx.rollback()
      throw e;
    }
    await trx.commit();
  }

  async runUpdateTransaction(updatesAreasMontly : AreaMontlyInfo[]) {
    const trx = await this.knex.transaction()
    try {
      for (const updateAreaMontlyInfo of updatesAreasMontly) {
        const affectedRows = await trx(this.getTableName()).where(this.getPrimaryKeyName(), updateAreaMontlyInfo.month).update(updateAreaMontlyInfo);
        if(affectedRows == 0) {
          throw new AppError(AppErrorCode.INVALID_DATA, `Erro ao tentar atualizar dados do relatório ${updateAreaMontlyInfo.area_name}`);
        }
      }
    } catch (e) {
      console.log("Fazendo roolback..")
      await trx.rollback()
      throw e;
    }
    await trx.commit();
  }
}