import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import BaseExcelImporter from '../../../../domain/excel-importers/base-excel-importer';
import RequesterExcelImporter from '../../../excel-importers/requester-excel-importer';
import ExcelReader from '../../../excel/excel-reader';
import AreaKnexRepository from '../../../repositories/knex/area-knex-repository';
import RequesterKnexRepository from '../../../repositories/knex/requester-knex-repository';
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from '../../utils/auth-utils';
import { wrapRoutesErrorHandler } from '../../utils/wrap-routes-error-handler';

export function generateImportRoutes(knex : Knex) {
  var router = express.Router();

  router.post("/", async (req : any, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      if(!req.files?.file) {
        res.status(StatusCodes.BAD_REQUEST).send("Nenhum arquivo foi recebido")
        return;
      }

      const excelReader = new ExcelReader()
      const areaRepository = new AreaKnexRepository(knex);
      const requesterRepository = new RequesterKnexRepository(areaRepository, knex);

      const typeToExcelImporter : { [key: string] : BaseExcelImporter } = {
        "requester-excel": new RequesterExcelImporter(requesterRepository, excelReader),
      }

      const type = req.body.type;

      const selectedExcelImporter = typeToExcelImporter[type];
      if(!selectedExcelImporter) {
        res.status(StatusCodes.BAD_REQUEST).send(`Tipo não reconhecido, envie um dos seguintes: ${
          Object.keys(typeToExcelImporter).join("/")
        }`)
      }

      const file = req.files.file;
      const data = await selectedExcelImporter.readExcel(file);
      res.send("Arquivo excel importado")
    })
  });
  return router;
}