import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";
import User from "../../domain/models/user";

export function requireLoggedUserToBeAdministradorOrThrow(authUser : User) {
  const autenticatedUser = authUser;
  if(autenticatedUser.role == "administrator") {
    throw new AppError(AppErrorCode.INSUFFICIENT_PERMISSIONS)
  }
}

export function getAuthDataOrThrow(res : any) : User {
  if(res.locals?.context) {
    return res.locals.context as User;
  } else {
    throw new AppError(AppErrorCode.NOT_AUTENTICATED);
  }
}