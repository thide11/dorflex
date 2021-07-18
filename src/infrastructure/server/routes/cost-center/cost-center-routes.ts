import express from 'express';
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from "../../utils/auth-utils";
import CostCenterRepository from "../../../../domain/repositories/cost-center-repository";
import { StatusCodes } from "http-status-codes";
import AppError from '../../../../domain/error/app-error';
import { AppErrorCode } from '../../../../domain/error/app-error-code';

export function generateCostCenterRoutes(costCenterRepository : CostCenterRepository) {
  var router = express.Router();

  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const costCenterData = req.body;
      const data = await costCenterRepository.insert({
        code: costCenterData.code,
        area: costCenterData.area,
        description: costCenterData.description,
        manager: costCenterData.manager,
      });
      res.status(StatusCodes.CREATED).send(data);
    });
  })

  router.get("/", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await costCenterRepository.list();
      res.send(data);
    });
  })

  router.get("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await costCenterRepository.get(req.params.id);
      if(!data) {
        res.status(StatusCodes.NOT_FOUND).send();
      }
      res.send(data);
    });
  })

  router.put("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const costCenterData = req.body;
      const keys = Object.keys(costCenterData);
      if(keys.length == 0) {
        throw new AppError(AppErrorCode.INVALID_DATA, "Você não enviou nenhum dado")
      }
      const putData : any = {}
      const allowedPutParameters = ["area", "description", "manager"];
      keys.forEach(e => {
        if(allowedPutParameters.includes(e)) {
          putData[e] = costCenterData.e
        } else {
          throw new AppError(AppErrorCode.INVALID_DATA, `Atributo '${e}' inesperado`)
        }
      })

      const updatedCostCenterData = await costCenterRepository.update(req.params.id, {
        area: costCenterData.area,
        description: costCenterData.description,
        manager: costCenterData.manager
      });
      if(!updatedCostCenterData) {
        res.status(StatusCodes.NOT_FOUND).send();
      }
      res.status(StatusCodes.OK).send(updatedCostCenterData);
    });
  })

  router.delete("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      await costCenterRepository.delete(req.params.id);
      res.status(StatusCodes.OK).send();
    });
  })

  return router;
}