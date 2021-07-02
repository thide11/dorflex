import ExcelReader from "../../infrastructure/excel/excel-reader";
import AppError from "../error/app-error";
import { AppErrorCode } from "../error/app-error-code";

export default abstract class BaseExcelImporter {

  constructor(private reader : ExcelReader) {};

  readExcel(buffer : any) {
    const excel = this.reader.readExcel(buffer);
    const modelList = excel.map((excelRow : any) => {
      return Object.entries(excelRow).reduce((op, [key,value]) => {
        let newKey = this.getExcelKeysToModelKeys[key]
        if(newKey == undefined) {
          throw new AppError(AppErrorCode.UNKNOW_EXCEL_COLUMN, `Coluna ${key} não reconhecida para este tipo de arquivo`)
        }
        //@ts-ignore
        op[newKey] = value
        return op
      },{})
    });
    console.log(modelList);
  }

  private saveRegister() {
    



  }



  protected abstract getExcelKeysToModelKeys : any;
}