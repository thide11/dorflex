import SolicitationItem from "../models/solicitation-item";
import BaseRepository from "./base-repository";

export default interface SolicitationItemRepository extends BaseRepository<SolicitationItem> {
    listBySolicitationId(solicitation : number) : Promise<SolicitationItem[]>
}