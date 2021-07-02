import xlsx from 'xlsx';

export default class ExcelReader {
  
  readExcel(buffer : any) {
    const workbook = xlsx.read(buffer);
    
    var first_sheet_name = workbook.SheetNames[0];
    console.log(first_sheet_name);
    var worksheet = workbook.Sheets[first_sheet_name];
    const allData = xlsx.utils.sheet_to_json(worksheet);
    return allData;
  }
}