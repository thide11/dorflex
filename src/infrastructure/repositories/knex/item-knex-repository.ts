import BaseKnexRepository from "./base-knex-repository";
import Item from "../../../domain/models/item";
import ItemRepository from "../../../domain/repositories/item-repository";

export default class ItemKnexRepository extends BaseKnexRepository<Item> implements ItemRepository {
  protected getValidatorRules() : Validator.Rules {
    return {
      sap_atena : 'string|required',
      sap_br : 'string',
      description : 'string',
      family : 'string',
      net_value : 'number|required',
      correction_factor : 'number',
      blocked : "boolean|required",
      area_name : "string|required", 
    }
  }

  protected getPrimaryKeyName() {
    return "sap_atena";
  }

  protected getTableName(): string {
    return "itens";
  }
}