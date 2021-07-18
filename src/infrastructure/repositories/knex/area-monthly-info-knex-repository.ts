import AreaRepository from "../../../domain/repositories/area-repository";
import UserRepository from "../../../domain/repositories/user-repository";
import BaseKnexRepository from "./base-knex-repository";
import Area from "../../../domain/models/area";
import Validator from 'validatorjs';
import AreaMontlyInfoRepository from "../../../domain/repositories/area-monthly-info-repository";
import AreaMontlyInfo from "../../../domain/models/area-montly-info";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";

export default class AreaMonthlyInfoKnexRepository extends BaseKnexRepository<AreaMontlyInfo> implements AreaMontlyInfoRepository {
  async updateByAreaAndMonth(year: number, month: number, areaName : string, data: any): Promise<AreaMontlyInfo> {
    const affectedRows = await this.getKnexQuery()
      .where("year", year)
      .andWhere("month", month)
      .andWhere("area_name", areaName)
      .update(data);
    if(affectedRows == 0) {
      throw new AppError(AppErrorCode.NOT_FOUND);
    }
    return data;
  }

  protected getValidatorRules() : Validator.Rules {
    return {      
    }
  };

  protected getPrimaryKeyName() {
    return "id";
  }

  protected getTableName(): string {
    return "area_monthly_info";
  }
}