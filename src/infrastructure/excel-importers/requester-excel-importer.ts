import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";

export default class RequesterExcelImporter extends BaseExcelImporter {
  protected getExcelKeysToModelKeys: any = {
    "Solicitante": "requester",
    "Área": "area",
  };
}