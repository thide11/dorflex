import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import RequesterRepository from "../../domain/repositories/requester-repository";
import ExcelReader from "../excel/excel-reader";

export default class RequesterExcelImporter extends BaseExcelImporter {
  protected async saveRegister(data: any[]): Promise<void> {
    for(const requester of data) {
      await this.requesterRepository.forceInsert(requester)
    };
  }

  constructor(private requesterRepository : RequesterRepository, reader : ExcelReader) {
    super(reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "Solicitante": "name",
    "Área": "area_name",
  };
}