import SolicitationItem from "../../../domain/models/solicitation-item";
import SolicitationItemRepository from "../../../domain/repositories/solicitation-item-repository";
import BaseKnexRepository from "./base-knex-repository";

export default 
  class SolicitationItemKnexRepository 
        extends BaseKnexRepository<SolicitationItem> implements SolicitationItemRepository {

  listBySolicitationId(solicitation: number): Promise<SolicitationItem[]> {
    return this.getKnexQuery().where("solicitation_id", solicitation).select();
  }

  protected getValidatorRules() : Validator.Rules {
    return {
        amount: "integer|required",
        solicitation_id: "integer|required",
    }
  };

  protected getTableName(): string {
    return "solicitation_item";
  }
  protected getPrimaryKeyName(): string {
    return "solicitation_id";
  }
}