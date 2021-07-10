import express from "express";
import { StatusCodes } from "http-status-codes";
import ItemRepository from "../../../../domain/repositories/item-repository";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow, requirePayloadOnBody } from "../../utils/auth-utils";
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";

export function generateItemRoutes(itemRepository : ItemRepository) {
  const router = express.Router();
  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requirePayloadOnBody(req);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const clientData = req.body;
      const data = await itemRepository.insert({
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

      const data = await itemRepository.list();
      res.send(data);
    });
  })
  return router;
}