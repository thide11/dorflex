import xlsx from 'xlsx';

export default class ExcelReader {
  readExcel(buffer : any) {
    const workbook = xlsx.read(buffer);
    const first_sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[first_sheet_name];
    const allData = xlsx.utils.sheet_to_json(worksheet);
    return allData;
  }
}