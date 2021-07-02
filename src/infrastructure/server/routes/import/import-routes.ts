import express from 'express';
import RequesterExcelImporter from '../../../excel-importers/requester-excel-importer';
import ExcelReader from '../../../excel/excel-reader';

export function generateImportRoutes() {
  var router = express.Router();

  router.post("/", (req : any, res) => {
    //@ts-ignore
    if(!req.files.file) {
      res.send("Nenhum arquivo foi recebido")
      return;
    }
    
    const excelFile = req.files.file;
    if(["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(excelFile.mimetype)) {  

      const excelReader = new ExcelReader()
      const typeToExcelImporter = {
        "requester-excel": new RequesterExcelImporter(excelReader),
      }

      const type = req.query.type;
      //@ts-ignore
      const selectedExcelImporter = typeToExcelImporter[type];
      console.log(req.files.file.data.length);
      const data = selectedExcelImporter.readExcel(req.files.file.data);
      res.send("Lido o excel")
    } else {
      res.send("Tipo de arquivo inválido, envie um excel")
    }
  })
  return router;
}