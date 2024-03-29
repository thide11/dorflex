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

  router.get("/", async (_, res) => {
    await wrapRoutesErrorHandler(res, async () => {
      const user = getAuthDataOrThrow(res);
      requireLoggedUserToBeAdministradorOrThrow(user);
      const usuarios = await userRepository.list()

      res.status(200).send(usuarios)
    });
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
      res.status(StatusCodes.CREATED).send();
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