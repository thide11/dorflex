import Area from "../models/area";
import AreaMontlyInfo from "../models/area-montly-info";
import BaseRepository from "./base-repository";

export default interface AreaMonthlyInfoRepository extends BaseRepository<AreaMontlyInfo> {
  updateByAreaAndMonth(year : number, month : number, areaName : string, data : any) : Promise<AreaMontlyInfo>;
}