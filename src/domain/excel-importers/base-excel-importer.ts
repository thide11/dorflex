import ExcelReader from "../../infrastructure/excel/excel-reader";
import AppError from "../error/app-error";
import { AppErrorCode } from "../error/app-error-code";
import ExcelUpload from "../models/excel-upload";
import User, { JWTUserData } from "../models/user";
import ExcelUploadsRepository from "../repositories/excel-uploads-repository";

export default abstract class BaseExcelImporter {

  constructor(private excelUploadsRepository : ExcelUploadsRepository , private reader : ExcelReader) {};

  private isAnExcelMimetype(mimetype : string) {
    return [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
      "application/vnd.ms-excel",
    ].includes(mimetype) 
  }

  async readExcel(userUploaded : JWTUserData, file : any) {
    const excelUpload = {
      date: new Date(),
      filename: file.name,
      result: "",
      user_uploaded: userUploaded.id,
    } as ExcelUpload
    try {
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
      await this.saveRegister(modelList);
      excelUpload.result = "Exito na importação";
      await this.excelUploadsRepository.insert(excelUpload)
    } catch (e) {
      excelUpload.result = "Erro: " + e.message;
      await this.excelUploadsRepository.insert(excelUpload)
      throw e
    }
  }

  protected abstract saveRegister(data : any[]) : Promise<void>;

  protected abstract getExcelKeysToModelKeys : any;
}