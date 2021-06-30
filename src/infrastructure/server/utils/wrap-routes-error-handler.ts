import { StatusCodes } from 'http-status-codes';
import AppError from '../../../domain/error/app-error';
import { AppErrorCode } from '../../../domain/error/app-error-code';
import getEnvOrReturnError from './get-env-or-return-error';

export async function wrapRoutesErrorHandler(res : any, fn : Function) {
  try {
    await fn();
  } catch(e) {
    if(e instanceof AppError) {
      switch(e.code) {
        case AppErrorCode.NOT_AUTENTICATED:
          return res.sendStatus(StatusCodes.UNAUTHORIZED);
        case AppErrorCode.INSUFFICIENT_PERMISSIONS:  
          return res.sendStatus(StatusCodes.FORBIDDEN);
        case AppErrorCode.INVALID_TOKEN:
          return res.status(StatusCodes.UNAUTHORIZED).send(e.message);
      }
    } else {
      console.log("Enviando 500!");
      const environment = getEnvOrReturnError("NODE_ENV");
      if(["development", "test"].includes(environment)) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message)
      } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  }
}