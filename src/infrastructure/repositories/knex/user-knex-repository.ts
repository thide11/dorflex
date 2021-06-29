import User from "../../../domain/models/user";
import BaseRepository from "../../../domain/repositories/base-repository";
import BaseKnexRepository from "./base-knex-repository"

import UserRepository from "../../../domain/repositories/user-repository"

export default class UserKnexRepository extends BaseKnexRepository<User> implements UserRepository {
  protected getPrimaryKeyName() {
    return "id";
  }
  
  protected getTableName() {
    return "users"
  };

  private getKnexWithWhereEmail(email : string) {
    return this.getKnexQuery().where("email", email);
  }
  
  getByEmail(email: string): Promise<User | undefined> {
    return this.getKnexWithWhereEmail(email).first();
  }

  getByEmailAndPassword(email: string, passwordHash: string): Promise<User | undefined> {
    return this.getKnexWithWhereEmail(email).where("passwordHash", passwordHash).first();
  }
}