import { Knex } from "knex";
import ExcelUpload from "../../../domain/models/excel-upload";
import ExcelUploadsRepository from "../../../domain/repositories/excel-uploads-repository";

export default class ExcelUploadsKnexRepository extends ExcelUploadsRepository {

  protected knex : Knex;
  constructor(knex : Knex) {
    super();
    this.knex = knex;
  }

  insert(excelUpload: ExcelUpload): Promise<void> {
    return this.knex.table("excel_uploads").insert(excelUpload);
  }

  list() : Promise<ExcelUpload[]> {
    return this.knex.table("excel_uploads").select();
  }
}