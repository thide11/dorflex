import ItemLimit from "../../../domain/models/item-limit";
import ItemLimitRepository from "../../../domain/repositories/item-limit-repository";
import BaseKnexRepository from "./base-knex-repository";

export default class ItemLimitKnexRepository extends BaseKnexRepository<ItemLimit> implements ItemLimitRepository {
  listByItemId(itemId: number): Promise<ItemLimit[]> {
    return this.getKnexQuery().where("item_id", itemId).select();
  }

  protected getValidatorRules() : Validator.Rules {
    return {
      id: 'integer'
    }
  };

  protected getTableName(): string {
    return "item_limit";
  }
  protected getPrimaryKeyName(): string {
    return "id";
  }

}