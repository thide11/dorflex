import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import ExcelUploadsRepository from "../../domain/repositories/excel-uploads-repository";
import RequesterRepository from "../../domain/repositories/requester-repository";
import ExcelReader from "../excel/excel-reader";

export default class RequesterExcelImporter extends BaseExcelImporter {

  public getFormalName: string = "Upload de Solicitante";

  protected async saveRegister(data: any[]): Promise<void> {
    for(const requester of data) {
      await this.requesterRepository.forceInsert(requester)
    };
  }

  constructor(private requesterRepository : RequesterRepository, excelUploadsRepository : ExcelUploadsRepository, reader : ExcelReader) {
    super(excelUploadsRepository, reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "Solicitante": "name",
    "Área": "area_name",
  };
}