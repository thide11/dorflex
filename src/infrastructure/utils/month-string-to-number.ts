import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";

export default function monthStringToNumber(monthString : string) {
  const monthsConverter : { [key: string] : number }= {
    janeiro: 0,
    fevereiro: 1,
    março: 2,
    abril: 3,
    maio: 4,
  }
  const month = monthsConverter[monthString.toLowerCase()]
  if(month == undefined) {
    throw new AppError(AppErrorCode.INVALID_DATA, `Mês dentro da planilha chamada '${monthString}' não reconhecida no sistema`)
  }
  return month;
}