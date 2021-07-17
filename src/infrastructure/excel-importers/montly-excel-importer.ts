import knex from "knex";
import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";
import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import AreaMontlyInfo from "../../domain/models/area-montly-info";
import AreaRepository from "../../domain/repositories/area-repository";
import ExcelUploadsRepository from "../../domain/repositories/excel-uploads-repository";
import ExcelReader from "../excel/excel-reader";
import AreaMontlyInfoKnexRepository from "../repositories/knex/area-montly-info-knex-repository";

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
        this.monthStringToNumber(defaultMonth!);
      } else {
        if(defaultMonth != month) {
          throw new AppError(AppErrorCode.INVALID_DATA, `Esperado que todos os mêses da tabela sejam ${item.defaultMonth}, mas foi recebido uma linha com o mês de ${month}`)
        }
      }
    })

    if(!defaultMonth) {
      throw new AppError(AppErrorCode.INVALID_DATA, `Mes não identificado`)
    }
    const defaultMonthNumber = this.monthStringToNumber(defaultMonth);
    const item_month_updates = []
    
    for(const item of data) {
      const month = defaultMonthNumber;
      const year = (new Date()).getFullYear();
      console.log(`${month}/${year}`)
      const date = new Date(year, month);
      item_month_updates.push({
        month: date,
        real_production: item.real_production,
      } as AreaMontlyInfo)
    };

    

    console.log(item_month_updates);
  }

  constructor(private areaRepository : AreaRepository, private areaMontlyInfoRepository : AreaMontlyInfoKnexRepository, excelUploadsRepository : ExcelUploadsRepository, reader : ExcelReader) {
    super(excelUploadsRepository, reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "Área": "area_name",
    "Mês": "month_string",
    "Quantidade de produção real": "real_production",
  }

  protected monthStringToNumber(monthString : string) {
    const monthsConverter : { [key: string] : number }= {
      janeiro: 0,
      fevereiro: 1,
      março: 2,
      abril: 3,
      maio: 4,
    }
    const month = monthsConverter[monthString.toLowerCase()]
    if(month == undefined) {
      throw new AppError(AppErrorCode.INVALID_DATA, `Mês dentro da planilha chamada '${monthString}' não reconhecida no sistema`)
    }
    return month;
  }

}