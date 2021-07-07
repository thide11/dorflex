import ExcelUpload from "../models/excel-upload";

export default abstract class ExcelUploadsRepository {
  abstract insert(excelUpload : ExcelUpload) : Promise<void>;
}