import express from "express";
import { StatusCodes } from "http-status-codes";
import SolicitationRepository from "../../../../domain/repositories/solicitation-repository";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow, requirePayloadOnBody } from "../../utils/auth-utils";
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";

export function generateSolicitationRoutes(solicitationRepository : SolicitationRepository) {
    const router = express.Router();

    router.post("/", async (req, res) => { 
      await wrapRoutesErrorHandler(res, async () => {
        const user = getAuthDataOrThrow(res);
        requirePayloadOnBody(req);
        requireLoggedUserToBeAdministradorOrThrow(user);
        const clientData = req.body;
        const data = await solicitationRepository.insert({
          ...clientData,
          user_id: user.id
        });
        res.status(StatusCodes.CREATED).send(data);
      });
    })
    
    router.get("/", async(req, res) => {
      await wrapRoutesErrorHandler(res, async () => {
        const user = getAuthDataOrThrow(res);
        requireLoggedUserToBeAdministradorOrThrow(user);
  
        const data = await solicitationRepository.list();
        res.send(data);
      });
    })
  
    router.get("/:id", async(req, res) => {
      await wrapRoutesErrorHandler(res, async () => {
        const user = getAuthDataOrThrow(res);
        requireLoggedUserToBeAdministradorOrThrow(user);
  
        const data = await solicitationRepository.get(req.params.id);
        if(!data) {
          res.sendStatus(StatusCodes.NOT_FOUND);
        }
        res.send(data);
      });
    })
    return router;
}