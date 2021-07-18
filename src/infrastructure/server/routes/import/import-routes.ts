import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import AppError from '../../../../domain/error/app-error';
import { AppErrorCode } from '../../../../domain/error/app-error-code';
import BaseExcelImporter from '../../../../domain/excel-importers/base-excel-importer';
import CostCenterAndAreaExcelImporter from '../../../excel-importers/cost-center-and-area-excel-importer';
import ItensYearExcelImporter from '../../../excel-importers/itens-year-excel-importer';
import MontlyExcelImporter from '../../../excel-importers/montly-excel-importer';
import ProductionVolumeLoadExcelImporter from '../../../excel-importers/production-volume-load-excel-importer';
import RequesterExcelImporter from '../../../excel-importers/requester-excel-importer';
import ExcelReader from '../../../excel/excel-reader';
import AreaKnexRepository from '../../../repositories/knex/area-knex-repository';
import AreaMontlyInfoKnexRepository from '../../../repositories/knex/area-monthly-info-knex-repository';
import CostCenterKnexRepository from '../../../repositories/knex/cost-center-knex-repository';
import ExcelUploadsKnexRepository from '../../../repositories/knex/excel-uploads-knex-repository';
import ItemKnexRepository from '../../../repositories/knex/item-knex-repository';
import ItemLimitKnexRepository from '../../../repositories/knex/item-limit-knex-repository';
import RequesterKnexRepository from '../../../repositories/knex/requester-knex-repository';
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from '../../utils/auth-utils';
import { wrapRoutesErrorHandler } from '../../utils/wrap-routes-error-handler';

export function generateImportRoutes(knex : Knex) {
  var router = express.Router();

  const excelReader = new ExcelReader()
  const areaRepository = new AreaKnexRepository(knex);
  const requesterRepository = new RequesterKnexRepository(areaRepository, knex);
  const excelUploadsRepository = new ExcelUploadsKnexRepository(knex);
  const itemRepository = new ItemKnexRepository(knex);
  const costCenterRepository = new CostCenterKnexRepository(knex);
  const areaMontlyInfoRepository = new AreaMontlyInfoKnexRepository(knex);
  const itemLimitRepository = new ItemLimitKnexRepository(knex);
  
  const typeToExcelImporter : { [key: string] : BaseExcelImporter } = {
    "requester-excel": new RequesterExcelImporter(requesterRepository, excelUploadsRepository, excelReader),
    "itens-year-excel": new ItensYearExcelImporter(areaRepository, itemRepository, excelUploadsRepository, excelReader),
    "cost-center-and-area-excel": new CostCenterAndAreaExcelImporter(areaRepository, costCenterRepository, excelUploadsRepository, excelReader),
    "montly-excel": new MontlyExcelImporter(areaRepository, areaMontlyInfoRepository, itemLimitRepository, excelUploadsRepository, excelReader),
    "production-volume-load-excel": new ProductionVolumeLoadExcelImporter(itemRepository, itemLimitRepository, areaRepository, areaMontlyInfoRepository, excelUploadsRepository, excelReader),
  }

  router.post("/", async (req : any, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      if(!req.files?.file) {
        throw new AppError(AppErrorCode.INVALID_DATA, "Nenhum arquivo foi recebido");
      }

      const type = req.body.type;

      const selectedExcelImporter = typeToExcelImporter[type];
      if(!selectedExcelImporter) {
        throw new AppError(AppErrorCode.INVALID_DATA, `Tipo não reconhecido, envie um dos seguintes: ${
          Object.keys(typeToExcelImporter).join("/")
        }`)
      }

      const file = req.files.file;
      await selectedExcelImporter.readExcel(user, file);
      res.status(StatusCodes.CREATED).send();
    })
  });

  router.get("/types", async (req : any, res) => {
    const possibleTypesAndFormalNames : any = {}
    Object.keys(typeToExcelImporter).map(e => {
      possibleTypesAndFormalNames[e] = typeToExcelImporter[e].getFormalName
    })
    res.status(StatusCodes.OK).send(possibleTypesAndFormalNames)
  })

  return router;
}