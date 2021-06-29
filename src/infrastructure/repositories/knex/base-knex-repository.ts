import { Knex } from "knex";
import BaseRepository from "../../../domain/repositories/base-repository";

export default abstract class BaseKnexRepository<T> implements BaseRepository<T> {
  protected abstract getTableName() : string;
  protected abstract getPrimaryKeyName() : string;
  protected knex : Knex;
  constructor(knex : Knex) {
    this.knex = knex;
  }

  async delete(id: any): Promise<void> {
    await this.getKnexQuery().where(this.getPrimaryKeyName(), id).delete();
  }

  async update(id : any, data: T): Promise<T> {
    await this.getKnexQuery().where(this.getPrimaryKeyName(), id).update(data);
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
    await this.getKnexQuery().insert(data);
    return data;
  }
}
