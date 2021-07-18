import RequesterRepository from "../../../../domain/repositories/requester-repository";
import express from "express";
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow, requirePayloadOnBody } from "../../utils/auth-utils";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../../domain/error/app-error";
import { AppErrorCode } from "../../../../domain/error/app-error-code";

export function generateRequesterRoutes(requesterRepository : RequesterRepository) {
  const router = express.Router();

  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requirePayloadOnBody(req);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const clientData = req.body;
      const data = await requesterRepository.insert({
        name: clientData.name,
        area_name: clientData.area_name,
      });
      res.status(StatusCodes.CREATED).send(data);
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
        res.status(StatusCodes.NOT_FOUND).send();
      }
      res.send(data);
    });
  })

  router.put("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requirePayloadOnBody(req);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const id = Number(req.params.id);
      const data = req.body;
      await requesterRepository.update(id, {
        name: data.name,
        area_name: data.area_name,
      });
      res.send(data);
    });
  })

  router.delete("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      await requesterRepository.delete(req.params.id);
      res.status(StatusCodes.OK).send();
    });
  })
  
  return router;
}