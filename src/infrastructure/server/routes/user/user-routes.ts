import User from "../../../../domain/models/user";
import UserRepository from "../../../../domain/repositories/user-repository";
import UserKnexRepository from "../../../repositories/knex/user-knex-repository";

import express from 'express';
import { wrapRoutesErrorHandler } from "../../utils/wrap-routes-error-handler";
import { getAuthDataOrThrow, requireLoggedUserToBeAdministradorOrThrow } from "../../utils/auth-utils";
import { StatusCodes } from 'http-status-codes';
import Auth from "../../../auth/auth";
import UncryptedUser from "../../../../domain/models/uncrypted-user";

export function generateUserRoutes(userRepository : UserRepository, auth : Auth) {

  var router = express.Router();

  router.get("/listar", async (_, res) => {
    const usuarios = await userRepository.list()
    console.log(usuarios)
    res.send("Usuario listados!")
  })

  router.post("/", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);

      const data = req.body;
      await auth.register({
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role
      } as UncryptedUser
      )
      res.sendStatus(StatusCodes.OK);
    });
  })

  router.get("/", async(req, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const data = await userRepository.list();
      res.send(data);
    });
  })

  return router;
}