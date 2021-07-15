import { Knex } from "knex";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";
import Solicitation from "../../../domain/models/solicitation";
import SolicitationItemRepository from "../../../domain/repositories/solicitation-item-repository";
import SolicitationRepository from "../../../domain/repositories/solicitation-repository";
import ItensYearExcelImporter from "../../excel-importers/itens-year-excel-importer";
import BaseKnexRepository from "./base-knex-repository";

export default class SolicitationKnexRepository extends BaseKnexRepository<Solicitation> implements SolicitationRepository {


  constructor(private solicitationItemRepository : SolicitationItemRepository, knex : Knex ) {
    super(knex);
  }

  async list() : Promise<Solicitation[]> {
    const itens =  await this.solicitationItemRepository.list();
    const solicitations = await this.getKnexQuery().select();
    return solicitations.map(e => {
      return {
        ...e,
        itens: itens.filter((item) => item.solicitation_id = e.id)
      } as Solicitation
    })
  }

  async get(id : any): Promise<Solicitation> {
    const solicitation = await this.getKnexQuery().where(this.getPrimaryKeyName(), id).first() as any;
    if(solicitation) {
      solicitation.itens = await this.solicitationItemRepository.listBySolicitationId(id)
      return solicitation;
    } 
    throw new AppError(AppErrorCode.NOT_FOUND);
  }

  async insert(solicitation: Solicitation): Promise<Solicitation> {
    this.validateData(solicitation);
    const itens = solicitation.itens;

    const solicitationWithoutItens = {...solicitation}
    //@ts-ignore
    delete solicitationWithoutItens.itens
    try {
      const generatedKey = await this.getKnexQuery().insert(solicitationWithoutItens, [this.getPrimaryKeyName()]);
      for(const item of itens) {
        item.solicitation_id = generatedKey[0].id;
        await this.solicitationItemRepository.insert(item);
      }
  
      return {
        ...solicitation,
        ...generatedKey[0],
      };
    } catch (e) {
      if(e?.code == '23503') {
        throw new AppError(AppErrorCode.INVALID_DATA, `Id de chave estrangeira inválida: ${e.detail}`)
      } else {
        throw e;
      }
    }
  }

  async delete(id: any): Promise<void> {
    await this.solicitationItemRepository.delete(id);
    const affectedRows = await this.getKnexQuery().where(this.getPrimaryKeyName(), id).delete();
    if(affectedRows == 0) {
      throw new AppError(AppErrorCode.NOT_FOUND);
    }
  }

  protected getValidatorRules() : Validator.Rules {
    return {
      id: 'integer',
      user_id: "integer|required",
      requester_id: "integer|required",
      order_number: "string|required",
      cost_center_code: 'integer|required',
      itens: "array|required"
    }
  }
  
  protected getTableName(): string {
    return "solicitation";
  }
  protected getPrimaryKeyName(): string {
    return "id";
  }
}