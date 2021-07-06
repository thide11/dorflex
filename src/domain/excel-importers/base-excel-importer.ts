import ExcelReader from "../../infrastructure/excel/excel-reader";
import AppError from "../error/app-error";
import { AppErrorCode } from "../error/app-error-code";

export default abstract class BaseExcelImporter {

  constructor(private reader : ExcelReader) {};

  private isAnExcelMimetype(mimetype : string) {
    return [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
      "application/vnd.ms-excel",
    ].includes(mimetype) 
  }

  readExcel(file : any) {
    if(!this.isAnExcelMimetype(file.mimetype)) {  
      throw new AppError(AppErrorCode.EXPECTED_EXCEL_FILE);
    }
    const buffer = file.data;
    const excel = this.reader.readExcel(buffer);
    const modelList = excel.map((excelRow : any) => {
      return Object.entries(excelRow).reduce((op, [key,value]) => {
        let newKey = this.getExcelKeysToModelKeys[key]
        if(newKey == undefined) {
          throw new AppError(AppErrorCode.UNKNOWN_EXCEL_COLUMN, `Coluna ${key} não reconhecida para este tipo de arquivo`)
        }
        //@ts-ignore
        op[newKey] = value
        return op
      },{})
    });
    return this.saveRegister(modelList);
  }

  protected abstract saveRegister(data : any[]) : Promise<void>;

  protected abstract getExcelKeysToModelKeys : any;
}