import RequesterRepository from "../../../../domain/repositories/requester-repository";
import express from "express";
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from "../../utils/auth-utils";
import { StatusCodes } from "http-status-codes";

export function generateRequesterRoutes(requesterRepository : RequesterRepository) {
  const router = express.Router();

  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const clientData = req.body;
      await requesterRepository.insert({
        id: clientData.id,
        name: clientData.name,
        area_name: clientData.area_name,
      });
      res.sendStatus(StatusCodes.CREATED)
    });
  })

  router.get("/", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await requesterRepository.list();
      res.send(data);
    });
  })

  router.get("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await requesterRepository.get(req.params.id);
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
      await requesterRepository.update(req.params.id, {
        id: Number(req.params.id),
        name: data.name,
        area_name: data.area_name,
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

      await requesterRepository.delete(req.params.id);
      res.sendStatus(StatusCodes.OK);
    });
  })
  
  return router;
}