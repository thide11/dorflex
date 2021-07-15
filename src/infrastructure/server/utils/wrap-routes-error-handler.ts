import { StatusCodes } from 'http-status-codes';
import AppError from '../../../domain/error/app-error';
import { AppErrorCode } from '../../../domain/error/app-error-code';
import isDevEnvironment from '../../utils/is-dev-environment';
import getEnvOrReturnError from './../../utils/get-env-or-return-error';

export function createErrorBody(message : string) {
  return {
    error: message,
  }
}

export async function wrapRoutesErrorHandler(res : any, fn : Function) {
  try {
    await fn();
  } catch(e) {
    if(e instanceof AppError) {
      switch(e.code) {
        case AppErrorCode.NOT_AUTENTICATED:
          return res.status(StatusCodes.UNAUTHORIZED)
            .send(createErrorBody("Você não está autenticado para acessar este recurso"));
        case AppErrorCode.INSUFFICIENT_PERMISSIONS:  
          return res.status(StatusCodes.FORBIDDEN)
            .send(createErrorBody("Permissão insuficiente para este recurso"));
        case AppErrorCode.INVALID_TOKEN:
          return res.status(StatusCodes.UNAUTHORIZED)
            .send(createErrorBody(e.message));
        case AppErrorCode.UNKNOWN_AREA_NAME:
          return res.status(StatusCodes.BAD_REQUEST) 
            .send(createErrorBody(e.message));
        case AppErrorCode.NOT_FOUND:
          return res.status(StatusCodes.NOT_FOUND)
            .send(createErrorBody(e.message));
        case AppErrorCode.EMPTY_DATA:
          return res.status(StatusCodes.BAD_REQUEST)
            .send(createErrorBody(e.message));
        case AppErrorCode.INVALID_DATA:
          return res.status(StatusCodes.BAD_REQUEST)
            .send(createErrorBody(e.message));
        case AppErrorCode.EXPECTED_EXCEL_FILE:
          return res.status(StatusCodes.BAD_REQUEST)
            .send(createErrorBody(e.message));
        default: 
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      }

    } else {
      console.log("Enviando 500!");
      console.log(e);
      if(isDevEnvironment()) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(createErrorBody(e.message));
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(createErrorBody("Ocorreu um erro interno no servidor"));
      }
    }
  }
}