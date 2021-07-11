import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";
import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import AreaRepository from "../../domain/repositories/area-repository";
import ExcelUploadsRepository from "../../domain/repositories/excel-uploads-repository";
import ItemRepository from "../../domain/repositories/item-repository";
import ExcelReader from "../excel/excel-reader";

export default class ItensYearExcelImporter extends BaseExcelImporter {

  protected async saveRegister(data: any[]): Promise<void> {
    const areas = await this.areaRepository.list();
    const nameAreas = areas.map(a => a.name);
    for(const item of data) {
      if(nameAreas.includes(item.area_name)) {
        delete item["max_value"]
        delete item["unit_value"]
        delete item["stock"]
        item.blocked = false;
        item.correction_factor = item.correction_factor * 100
        await this.itemRepository.insert(item)
      } else {
        throw new AppError(AppErrorCode.UNKNOWN_AREA_NAME);
      }
    };
  }

  constructor(private areaRepository : AreaRepository, private itemRepository : ItemRepository, excelUploadsRepository : ExcelUploadsRepository, reader : ExcelReader) {
    super(excelUploadsRepository, reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "SAP Atena": "sap_atena",
    "SAP br": "sap_br",
    "Descrição": "description",
    "Valor Unitário": "unit_value",
    "Área": "area_name",
    "Família": "family",
    "Código do estoque": "stock_code",
    "Estoque": "stock",
    "Quantidade Máxima": "max_value",
    "Valor NET": "net_value",
    "Fator de Correção NET": "correction_factor",
  }
}