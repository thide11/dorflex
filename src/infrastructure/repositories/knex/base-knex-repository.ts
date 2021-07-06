import { Knex } from "knex";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";
import BaseRepository from "../../../domain/repositories/base-repository";
import Validator from 'validatorjs';
Validator.useLang("pt")

export default abstract class BaseKnexRepository<T> implements BaseRepository<T> {
  protected abstract getTableName() : string;
  protected abstract getPrimaryKeyName() : string;
  protected abstract getValidatorRules() : Validator.Rules;
  protected knex : Knex;
  constructor(knex : Knex) {
    this.knex = knex;
  }

  validateData(data : any) {
    if(!data) {
      throw new AppError(AppErrorCode.EMPTY_DATA)
    }
    const validation = new Validator(data, this.getValidatorRules());
    if(validation.fails()) {
      throw new AppError(AppErrorCode.INVALID_DATA, JSON.stringify(validation.errors.all()))
    }
  }

  async delete(id: any): Promise<void> {
    const affectedRows = await this.getKnexQuery().where(this.getPrimaryKeyName(), id).delete();
    if(affectedRows == 0) {
      throw new AppError(AppErrorCode.NOT_FOUND);
    }
  }

  async update(id : any, data: T): Promise<T> {
    this.validateData(data);
    const affectedRows = await this.getKnexQuery().where(this.getPrimaryKeyName(), id).update(data);
    if(affectedRows == 0) {
      throw new AppError(AppErrorCode.NOT_FOUND);
    }
    return data;
  }

  protected getKnexQuery() {
    return this.knex(this.getTableName());
  }
  
  get(id : any): Promise<T> {
    return this.getKnexQuery().where(this.getPrimaryKeyName(), id).first();
  }
  
  list() : Promise<T[]> {
    return this.getKnexQuery().select();
  }
  
  async insert(data: T): Promise<T> {
    this.validateData(data);
    const generatedKey = await this.getKnexQuery().insert(data, [this.getPrimaryKeyName()]);
    return {
      ...data,
      ...generatedKey[0],
    };
  }
}
