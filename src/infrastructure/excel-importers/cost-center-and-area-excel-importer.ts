import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";
import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import AreaRepository from "../../domain/repositories/area-repository";
import CostCenterRepository from "../../domain/repositories/cost-center-repository";
import ExcelUploadsRepository from "../../domain/repositories/excel-uploads-repository";
import ExcelReader from "../excel/excel-reader";

export default class CostCenterAndAreaExcelImporter extends BaseExcelImporter {

  protected async saveRegister(data: any[]): Promise<void> {
    
    const areas = await this.areaRepository.list();
    const nameAreas = areas.map(a => a.name);
    for(const item of data) {
      if(!nameAreas.includes(item.area_name)) {
        await this.areaRepository.insert({name: item.area_name})
      }
      await this.costCenterRepository.insert({
        code: item.code,
        area: item.area_name,
        manager: item.manager,
        description: item.description,
      })
    };
  }

  constructor(private areaRepository : AreaRepository, private costCenterRepository : CostCenterRepository, excelUploadsRepository : ExcelUploadsRepository, reader : ExcelReader) {
    super(excelUploadsRepository, reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "Centro": "code",
    "Descrição": "description",
    "Área": "area_name",
    "Gestor": "manager",
  }
}