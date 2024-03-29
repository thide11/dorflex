import Area from "../models/area";
import BaseRepository from "./base-repository";

export default interface AreaRepository extends BaseRepository<Area> {
  getByName(areaName : string) : Promise<Area | null>;
}