import { REQUEST_HEADER_FIELDS_TOO_LARGE } from "http-status-codes";
import AppError from "../../../domain/error/app-error";
import { AppErrorCode } from "../../../domain/error/app-error-code";
import User from "../../../domain/models/user";

export function requireLoggedUserToBeAdministradorOrThrow(authUser : User) {
  const autenticatedUser = authUser;
  if(autenticatedUser.role != "administrator") {
    throw new AppError(AppErrorCode.INSUFFICIENT_PERMISSIONS)
  }
}

export function requirePayloadOnBody(req : any) {
  const body = req.body
  if(!body || (
    body && Object.keys(body).length === 0 && body.constructor === Object
  )) {
    throw new AppError(AppErrorCode.EMPTY_DATA)
  }
}

export function getAuthDataOrThrow(res : any) : User {
  if(res.locals?.context) {
    return res.locals.context as User;
  } else {
    throw new AppError(AppErrorCode.NOT_AUTENTICATED);
  }
}