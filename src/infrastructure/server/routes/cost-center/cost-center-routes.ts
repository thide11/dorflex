import express from 'express';
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from "../../utils/auth-utils";
import CostCenterRepository from "../../../../domain/repositories/cost-center-repository";
import { StatusCodes } from "http-status-codes";

export function generateCostCenterRoutes(costCenterRepository : CostCenterRepository) {
  var router = express.Router();

  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const costCenterData = req.body;
      const data = await costCenterRepository.insert({
        area: costCenterData.area,
        code: costCenterData.code,
        description: costCenterData.description,
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
        res.sendStatus(StatusCodes.NOT_FOUND);
      }
      res.send(data);
    });
  })

  router.put("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const costCenterData = req.body;
      await costCenterRepository.update(req.params.id, {
        area: costCenterData.area,
        code: costCenterData.code,
        description: costCenterData.description,
      });
      if(!costCenterData) {
        res.sendStatus(StatusCodes.NOT_FOUND);
      }
      res.send(costCenterData);
    });
  })

  router.delete("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      await costCenterRepository.delete(req.params.id);
      res.sendStatus(StatusCodes.OK);
    });
  })

  return router;
}