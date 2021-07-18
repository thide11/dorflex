import AreaMontlyInfo from "../models/area-montly-info";
import ItemLimit from "../models/item-limit";
import BaseRepository from "./base-repository";

export default interface ItemLimitRepository extends BaseRepository<ItemLimit> {
  listByItemId(itemId : number) : Promise<ItemLimit[]>
  // calculateMathFormulas(item : Item, itemMonth : AreaMontlyInfo )
}