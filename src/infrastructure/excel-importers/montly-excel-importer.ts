import knex from "knex";
import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";
import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import AreaMontlyInfo from "../../domain/models/area-montly-info";
import AreaRepository from "../../domain/repositories/area-repository";
import ExcelUploadsRepository from "../../domain/repositories/excel-uploads-repository";
import ItemLimitRepository from "../../domain/repositories/item-limit-repository";
import ExcelReader from "../excel/excel-reader";
import AreaMontlyInfoKnexRepository from "../repositories/knex/area-monthly-info-knex-repository";
import ItemLimitKnexRepository from "../repositories/knex/item-limit-knex-repository";
import monthStringToNumber from "../utils/month-string-to-number";

export default class MontlyExcelImporter extends BaseExcelImporter {

  public getFormalName: string = "Upload de planilha mensal";

  protected async saveRegister(data: any[]): Promise<void> {
    const areas = await this.areaRepository.list();
    const nameAreas = areas.map(a => a.name);

    let defaultMonth : string | undefined;

    data.forEach(item => {
      if(!nameAreas.includes(item.area_name)) {
        throw new AppError(AppErrorCode.UNKNOWN_AREA_NAME, `Erro: Área com o nome ${item.area_name} desconhecida, ela está incluida no sistema?`);
      }
      const month = item.month_string;
      if(defaultMonth == null) {
        defaultMonth = month;
        monthStringToNumber(defaultMonth!);
      } else {
        if(defaultMonth != month) {
          throw new AppError(AppErrorCode.INVALID_DATA, `Esperado que todos os mêses da tabela sejam ${item.defaultMonth}, mas foi recebido uma linha com o mês de ${month}`)
        }
      }
    })

    if(!defaultMonth) {
      throw new AppError(AppErrorCode.INVALID_DATA, `Mes não identificado`)
    }
    const defaultMonthNumber = monthStringToNumber(defaultMonth);
    

    const transaction = await this.areaMontlyInfoRepository.createTransaction();
    this.areaMontlyInfoRepository.setTransaction(transaction);

    try {
      for(const item of data) {
        const month = defaultMonthNumber;
        const year = (new Date()).getFullYear();

        const updatedAreaMonth = {
          real_production: item.real_production,
        } as AreaMontlyInfo;
        await this.areaMontlyInfoRepository.updateByAreaAndMonth(year, month, item.area_name, updatedAreaMonth);
        const itemLimits = await this.itemLimitRepository.list();
        //itemLimits.
      };
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
    this.areaMontlyInfoRepository.removeTransaction();
    await transaction.commit();
  }

  constructor(private areaRepository : AreaRepository, private areaMontlyInfoRepository : AreaMontlyInfoKnexRepository, private itemLimitRepository : ItemLimitRepository, excelUploadsRepository : ExcelUploadsRepository, reader : ExcelReader) {
    super(excelUploadsRepository, reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "Área": "area_name",
    "Mês": "month_string",
    "Quantidade de produção real": "real_production",
  }
}