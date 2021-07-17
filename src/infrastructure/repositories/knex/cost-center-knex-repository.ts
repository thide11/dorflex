import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";
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

  async insert(data: CostCenter): Promise<CostCenter> {
    try {
      return await super.insert(data)
    } catch(e) {
      this.readError(data, e);
    }
  }

  async update(id : any, data: CostCenter): Promise<CostCenter> {
    try {
      return await super.update(id, data);
    } catch(e) {
      this.readError(data, e)
    }
  }

  private readError(data : any, e : any) : never {
    console.log(e);
    if(e.code == "23505") {
      throw new AppError(AppErrorCode.INVALID_DATA, `O código '${data.code}' já existe no banco`)
    }
    if(e.code == "23503" && e?.constraint == "cost_center_area_foreign") {
      throw new AppError(AppErrorCode.UNKNOWN_AREA_NAME, `Área com o nome '${data.area}' desconhecida no banco`)
    } else {
      throw e;
    }
  }

}