import AreaRepository from "../../../../domain/repositories/area-repository";
import express from "express";
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from "../../utils/auth-utils";
import { StatusCodes } from "http-status-codes";

export function generateAreaRoutes(areaRepository : AreaRepository) {
  const router = express.Router();

  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const clientData = req.body;
      await areaRepository.insert({
        code: clientData.code,
        name: clientData.name,
        solicitation_is_blocked: clientData.solicitation_is_blocked,
      });
      res.sendStatus(StatusCodes.CREATED)
    });
  })

  router.get("/", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await areaRepository.list();
      res.send(data);
    });
  })

  router.get("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await areaRepository.get(req.params.id);
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

      const data = req.body;
      await areaRepository.update(req.params.id, {
        code: Number(req.params.id),
        name: data.name,
        solicitation_is_blocked: data.solicitation_is_blocked,
      });
      if(!data) {
        res.sendStatus(StatusCodes.NOT_FOUND);
      }
      res.send(data);
    });
  })

  router.delete("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      await areaRepository.delete(req.params.id);
      res.sendStatus(StatusCodes.OK);
    });
  })
  
  return router;
}