import express from "express";
import { StatusCodes } from "http-status-codes";
import Item from "../../../../domain/models/item";
import ItemRepository from "../../../../domain/repositories/item-repository";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow, requirePayloadOnBody } from "../../utils/auth-utils";
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";

export function generateItemRoutes(itemRepository : ItemRepository) {
  const router = express.Router();

  function getItemOnBody(clientData : Item) {
    return {
      area_name: clientData.area_name,
      blocked: clientData.blocked,
      correction_factor: clientData.correction_factor,
      description: clientData.description,
      family: clientData.family,
      net_value: clientData.net_value,
      sap_atena: clientData.sap_atena,
      sap_br: clientData.sap_br
    }
  }

  router.post("/", async (req, res) => { 
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requirePayloadOnBody(req);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const clientData = req.body;
      const data = await itemRepository.insert(
        getItemOnBody(clientData)
      );
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

  router.get("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = await itemRepository.get(req.params.id);
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

      const item = await itemRepository.update(req.params.id, getItemOnBody(req.body))
      if(!item) {
        res.sendStatus(StatusCodes.NOT_FOUND);
      }
      res.send(item);
    });
  })

  router.delete("/:id", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      await itemRepository.delete(req.params.id);
      res.sendStatus(StatusCodes.OK);
    });
  })

  return router;
}