import { AppErrorCode } from "./app-error-code";

export default class AppError extends Error {
  constructor(public code : AppErrorCode, message? : string) {
    super(message ?? AppError.errorCodeToMessage(code))
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static errorCodeToMessage(code : AppErrorCode) {
    const errorCodeToMessage : { [key : string] : string } = {
      [`${AppErrorCode.NOT_AUTENTICATED}`]: "Você não esta autenticado para efetuar esta operação!",
      [`${AppErrorCode.INSUFFICIENT_PERMISSIONS}`]: "Você não tem permissão para efetuar esta operação",
      [`${AppErrorCode.INVALID_TOKEN}`]: "Token de autenticação invalido ou expirado",
      [`${AppErrorCode.UNKNOWN_EXCEL_COLUMN}`]: "Coluna do excel desconhecida",
      [`${AppErrorCode.UNKNOWN_AREA_NAME}`]: "Nome da área não encontrado no banco de dados",
      [`${AppErrorCode.NOT_FOUND}`]: "Não encontrado um model com este id",
      [`${AppErrorCode.EMPTY_DATA}`]: "Data não recebida",
    }
    return errorCodeToMessage[code];
  }
}