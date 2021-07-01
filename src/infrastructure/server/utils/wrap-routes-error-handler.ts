import { StatusCodes } from 'http-status-codes';
import AppError from '../../../domain/error/app-error';
import { AppErrorCode } from '../../../domain/error/app-error-code';
import isDevEnvironment from '../../utils/is-dev-environment';
import getEnvOrReturnError from './../../utils/get-env-or-return-error';

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
      console.log(e);
      if(isDevEnvironment()) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message)
      } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  }
}